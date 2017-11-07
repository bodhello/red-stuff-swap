import { Component, Input } from '@angular/core';
import {Modal, ModalController, NavController, NavParams} from 'ionic-angular';

import { ItemDetailPage } from '../../pages/item-detail/item-detail';
import { EditItemPage } from '../../pages/edit-item/edit-item';
import {EmailComposer} from "@ionic-native/email-composer";

/**
 * Generated class for the ItemListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'item-listing',
  templateUrl: 'item-listing.html'
})
export class ItemListingComponent {

  @Input('data') data: any;
  stars = ["star", "star", "star", "star", "star"];

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private emailComposer: EmailComposer) {}

  ngOnInit(){
    let counter = 0;
    for(let i = 0; i < Math.floor(this.data.rating); i++){
      this.stars[counter] = "star";
      counter++;
    }
    if(this.data.rating - counter >= 0.5){
      this.stars[counter] = "star-half";
    }else{
      this.stars[counter] = "star-outline";
    }
    counter++;
    for(let i = 0; i < 4 - Math.floor(this.data.rating); i++){
      this.stars[counter] = "star-outline";
      counter++;
    }
  }

  showItemDetails() {
    this.navCtrl.push("ItemDetailPage", {
      itemName: this.data.name,
    });
  }

  openEmailDialog() {
    // const newEmailModal:Modal = this.modalCtrl.create('EmailPage', {email: this.data.email, name: this.data.person_name});
    // newEmailModal.present();
    this.emailComposer.open({to: this.data.email, isHtml: true});
  }

  openEditDialog(){
    this.navCtrl.push("EditItemPage", {
      data: this.data,
    });
  }

  reserve(event){
    event.stopPropagation();
  }
}
