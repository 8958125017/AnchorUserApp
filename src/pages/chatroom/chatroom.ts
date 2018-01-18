import { Component,   NgZone,   } from '@angular/core';
import {  IonicPage, NavParams, Platform,NavController,Events } from 'ionic-angular';
import { SendMessageWithContent } from '../../interfaces/user-options';
import { SetupService } from '../../providers/setup.services'; 
import   *as socketIOClient  from 'socket.io-client';
import *as sailsIOClient  from 'sails.io.js';
import { UserEmailId } from '../../interfaces/user-options';


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
   UserId: UserEmailId = { email: '' };
  constructor(private ngZone: NgZone,public platform:Platform,private navCtrl:NavController,private navParams: NavParams, 
    public _setupService: SetupService, public events: Events) {
  //this.io.sails.url = this._setupService.endpoint_url;    // connect to socket  
     this.io.sails.url = "http://198.187.28.200:3000"; 
  this.userdata();

    this.messageDetails.sender=this.UserId.email;  
    this.nickname = this.messageDetails.sender; 
    this.messageDetails.recipient=this.navParams.get('receiver');
    this.messageDetails.chatId=this.navParams.get('chatId'); 
    this.chatid.chatId=this.messageDetails.chatId;

    // used for enabel device back button
    let backAction =  platform.registerBackButtonAction(() => {        
        this.navCtrl.pop();
        backAction();
      },2)

   


     
  

    // create connection between user based on chat id 

     this.io.socket.get('/chat/sendMessage',{chatId:this.messageDetails.chatId}, function(data, response){
    
     });

     // get old message based on chat id

     this._setupService.getChatMessages({chatId:this.messageDetails.chatId}).subscribe((response)=>{
       if(response.statusCode==200){      
        this.messages=response.data;
      }else{
       
      }
     })

     // event listner when any events brodcast messages
     var ngZ = this.ngZone;
     var event=this.events;
     
     this.io.socket.on('NEWMESSAGE', function(respons){     
        ngZ.run(() => {
        this.messages = respons.data;        
        event.publish("sharemessage",  this.messages);  
       });   
    })  
   this.listenToDataChangeEvents();   
 }

 userdata(){       
     this.user=JSON.parse(localStorage.getItem('logindetail'));
         if(this.user!=null||this.user!=undefined){
        this.UserId.email=this.user.user.email;
      }
    }
 listenToDataChangeEvents() {
 this.events.subscribe('sharemessage', (userData) => {  
       this.messages.push(userData);
       this.userContent='';
  });         
 }


 sendMessage() { 
  this.messageDetails.content = this.userContent  ; 
     this.io.socket.post('/chat/sendMessage',this.messageDetails, function(data, response){
   
   })

  }

  
 ionViewWillLeave() {
   this.io.socket.disconnect();
   delete this.io.sails;
  }

}

