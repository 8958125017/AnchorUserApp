import { Component } from '@angular/core';
import {  NavController, NavParams ,Platform  } from 'ionic-angular';
import { SetupService } from '../../providers/setup.services';
import { ChatroomPage } from '../../pages/chatroom/chatroom';
import { UserEmailId } from '../../interfaces/user-options';
import { Geolocation } from '@ionic-native/geolocation';
 import  {GmapPage } from '../gmap/gmap';
/**
 * Generated class for the ChatuserlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-chatuserlist',
  templateUrl: 'chatuserlist.html',
})
export class ChatuserlistPage {

 public userData:any=[];
  nickname = '';
  UserId: UserEmailId = { email: '' };
  public user:any;
  public friendList:any;
public latitude: number;
  public longitude: number;
  public zoom: number;
  constructor(private geolocation: Geolocation,public _setupService: SetupService, public navCtrl: NavController, public navParams: NavParams,public platform: Platform) {
     let backAction =  platform.registerBackButtonAction(() => {
       
        this.navCtrl.pop();
        backAction();
      },2)
     this.userdata();
    

      this._setupService.getfrienlist({email:this.UserId.email}).subscribe((response) => {
           if(response.statusCode==200){
              this.friendList=response.data; 
              console.log(" this.friendList = = "+JSON.stringify(this.friendList)); 
             }   
      });
  }
  userdata(){       
     this.user=JSON.parse(localStorage.getItem('logindetail'));
         if(this.user!=null||this.user!=undefined){
        this.UserId.email=this.user.user.email;
      }
    }

   openChat(senderEmail,receiverEmail,chatId){  
   // alert("senderEmail = = "+senderEmail);  
   // alert("receiverEmail = = "+receiverEmail);
   // alert("chatId = = "+chatId);    
         this.navCtrl.push(ChatroomPage, { sender: senderEmail, receiver: receiverEmail,chatId:chatId});    
  }
  
  joinChat() {
      this.navCtrl.push('ChatRoomPage', { nickname: this.nickname });
  }

  ionViewDidLoad() {
  this.platform.ready().then(() =>  {        
         let options = {
            enableHighAccuracy: true, 
            maximumAge: 3600,
            timeout:10000
       }; 
       this.geolocation.getCurrentPosition(options).then((response) => {
       this.latitude =response.coords.latitude;             
       this.longitude =response.coords.longitude;
      this.zoom = 16;      

       }).catch((error) => {   
     });
   });  

  }

  addTraders(){
    this.navCtrl.setRoot(GmapPage);
  }

}

