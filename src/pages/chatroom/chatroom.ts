import { Component, ElementRef,  NgZone, OnInit, ViewChild } from '@angular/core';
import {  IonicPage, NavParams, ToastController,Platform,NavController,Events } from 'ionic-angular';
import { SendMessageWithContent } from '../../interfaces/user-options';
import { SetupService } from '../../providers/setup.services'; 
import   *as socketIOClient  from 'socket.io-client';
import *as sailsIOClient  from 'sails.io.js';



@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {   
  nickname = '';
  chatId = '';
  data:any; 
  user:any;
  socket:any;
  io:any= sailsIOClient(socketIOClient); 
  messageDetails: SendMessageWithContent = { sender: '', recipient: '',content:'',chatId:'' };
  messages =[] ;
  userContent:any;

 chatid={
           "chatId": ""           
  }

  myInfo = this.messages[0];
  
  constructor(private ngZone: NgZone,public platform:Platform,private navCtrl:NavController,private navParams: NavParams, 
    public _setupService: SetupService, private toastCtrl: ToastController,public events: Events) {
    this.user=JSON.parse(localStorage.getItem('logindetail'));    

    // used for enabel device back button
    let backAction =  platform.registerBackButtonAction(() => {        
        this.navCtrl.pop();
        backAction();
      },2)


    this.io.sails.url = 'http://192.168.0.120:1338';     // connect to socket  
    var ngZ = this.ngZone;
     var event=this.events;

    // create connection between user based on chat id 

     this.io.socket.get('/chat/sendMessage',{chatId:33}, function(data, response){
      console.log("response = = "+response);
     });

     // get old message based on chat id

     this._setupService.getChatMessages({chatId:1}).subscribe((response)=>{
       if(response.statusCode==200){
       console.log("res = = "+JSON.stringify(response));
        this.messages.push(response.data);
      }else{
        console.log("No message founds");
      }
     })

     // event listner when any events brodcast messages

     this.io.socket.on('NEWMESSAGE', function(respons){ 
        ngZ.run(() => {
        this.messages = respons;
        event.publish("sharemessage",  this.messages);        
          console.log("this.messages.content "+this.messages.content);
       });   
    })  
    

    this.messageDetails.sender=this.navParams.get('sender'); 
    //this.nickname = this.messageDetails.sender;
    this.nickname = "pankajjoshi115@gmail.com";
    this.messageDetails.recipient=this.navParams.get('receiver');
    this.messageDetails.chatId=this.navParams.get('chatId');
    this.chatid.chatId=this.messageDetails.chatId;

   //   this._setupService.getOldMessage().subscribe((response)=>{
   //   this.messages=response.data;    
   // })

   this.listenToDataChangeEvents();
   
 }


 listenToDataChangeEvents() {
 this.events.subscribe('sharemessage', (userData) => {  
       this.messages.push(userData);
  });         
 }


 sendMessage() { 
  this.messageDetails.content = this.userContent  ;
  var ngZ = this.ngZone;
     var event=this.events;
     this.io.socket.post('/chat/sendMessage',this.messageDetails, function(data, response){
     console.log("response  = = "+JSON.stringify(response)); 
    
   })

  }

  
 ionViewWillLeave() {
   this.io.socket.disconnect();
   delete this.io.sails;
  }

ngOnDestroy() {
   this.io.socket.disconnect();
   delete this.io.sails;
}

}

class ContactInfo {
  constructor(public description: string) {}
}