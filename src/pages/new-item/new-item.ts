import {Component} from '@angular/core';
import {
  ActionSheetController, IonicPage, LoadingController, NavController, Platform,
  ToastController
} from 'ionic-angular';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {Camera} from "@ionic-native/camera";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import {File} from "@ionic-native/file";
import * as firebase from "firebase";
import {environment} from "../../environments/environment";

/**
 * Generated class for the NewItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-item',
  templateUrl: 'new-item.html',
})
export class NewItemPage {

  private _itemRef: AngularFireList<any>;
  private _loader: any;

  private itemName: string = "";
  private itemDescription: string = "";
  private lendTime: number = 7;
  private itemImgUrl: string = "";
  private credit: number = 10;

  constructor(private db: AngularFireDatabase, private navCtrl: NavController, private camera: Camera,
              private transfer: Transfer, private file: File, private filePath: FilePath,
              private actionSheetCtrl: ActionSheetController, private toastCtrl: ToastController,
              private platform: Platform, private loadingCtrl: LoadingController) {
    this._itemRef = this.db.list('/item');
    firebase.initializeApp(environment.firebase);
  }

  addItem() {
    this._itemRef.push({
      credit: this.credit,
      // todo wrong url
      image_url: this.itemImgUrl,
      name: this.itemName,
      rating: 0,
      reviews_num: 0,
      status: "on_shell",
      time_created: Date.now(),
      time_range: this.lendTime,
      description: this.itemDescription,
      // todo change these after user system is done
      email: "swethaviswanatha2018@u.northwestern.edu",
      person_name: "Swetha",
      // todo this should not be here
      radius: 2
    });
    this.navCtrl.pop();
  }

  private uploadImage(imageData){
    // todo should add user directory
    const pictures = firebase.storage().ref(`images/${NewItemPage.createFileName()}`);
    try{
      pictures.putString(imageData, 'base64', {contentType: 'image/jpeg'})
        .then(snapshot=>{
          this.itemImgUrl = snapshot.downloadURL;
          this._loader.dismiss();
        }).catch(error=>{
        this.presentToast(`error: ${error}`);
      });
    }catch(err){
      this.itemDescription=`some error occured, error message: ${err.message}`;
    }
  }

  pickImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(sourceType) {
    // Create options for the Camera Dialog
    let options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imageData) => {
      this._loader = this.loadingCtrl.create({content: `Please wait...`});
      this._loader.present();
      this.uploadImage(imageData);
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private static createFileName() {
    let d = new Date(),
      n = d.getTime();
    return n + ".jpg";
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  private pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }
}
