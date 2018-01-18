import { AgmMap, MapsAPILoader, } from '@agm/core';
import {  NavController,Platform, LoadingController,Events ,ToastController} from 'ionic-angular';
import { Component, ElementRef,  NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Markers,ChatRequest,TrderinfoGet,updateValue } from '../../interfaces/user-options';
import { } from 'googlemaps';
import { SetupService } from '../../providers/setup.services'; 
import { Storage } from '@ionic/storage';
//import { UserData } from '../../providers/user-data';
import { Geolocation } from '@ionic-native/geolocation';
import   *as socketIOClient  from 'socket.io-client';
import *as sailsIOClient  from 'sails.io.js';
import { ChatuserlistPage } from '../chatuserlist/chatuserlist';
/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-map',
  styles: [`
    agm-map {
      height: 100%;
      width:100%;
    }
  `],
  templateUrl: 'gmap.html',
})
export class GmapPage implements OnInit{
   @ViewChild("search")
   searchElementRef: ElementRef;
   @ViewChild(AgmMap)
   agmMap: AgmMap
   io:any= sailsIOClient(socketIOClient); 
   tradersMarker: Markers[];
   currentUserMarkers: Markers[];
   latitude: number;
   longitude: number;
   zoom: number;
   icon:any;
   searchControl: FormControl;
   userData:any=[];
   data:boolean;
   name:string;
   user:any;
   useremail:boolean;
   responseData:any;

   btcValues:any;
   inrValues:any;
   updatedTradersValue :any;
   tradersUpdate : any[] = [];

   chatRequest: ChatRequest = { sender: '', recipient: '' };
   trderinfoGet: TrderinfoGet = { email: '' }; 
   traderBtcValueAfterUpdate: updateValue= { email: '', buyRate: '0', currencyType:'',volume:'0',sellRate:'0' };  
   traderInrValueAfterUpdate: updateValue= { email: '', buyRate: '0', currencyType:'',volume:'0',sellRate:'0' };  
  constructor(public navCtrl: NavController,public toastCtrl: ToastController,public events: Events,private geolocation: Geolocation,public platform: Platform,public loadingCtrl: LoadingController,public storage: Storage,private mapsAPILoader: MapsAPILoader,public _setupService: SetupService, private ngZone: NgZone ) 
   {
           this.io.sails.url = "http://198.187.28.200:3000";     
      this.data=false;
      this.userdata();     
      if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;    
        this.zoom = 16;              
      });
    }
      this.setCurrentPosition();
       var ngZ = this.ngZone;
       var event=this.events;
     this.io.socket.on('updatedTrades', function(respons){      
        ngZ.run(() => {        
        event.publish("ShareUpdatedValues",respons.data[0]);
       });   

    })  
     this.listenToDataChangeEvents();
   }



listenToDataChangeEvents() {

 this.events.subscribe('ShareUpdatedValues', (userData) => { 
   this.clickedMarker(this.trderinfoGet.email);
   for(var i=0;i<this.tradersUpdate.length; i++){
     if(userData==undefined){
     }
     else{
     if(this.tradersUpdate[i].currencyType == userData.currencyType){
       this.tradersUpdate[i] = userData;
     }
   }
   }
})




 }

   //end constructor

   currenloct(){
      this.setCurrentPosition();
    }
   
   userdata(){      
     this.user=JSON.parse(localStorage.getItem('logindetail'));
       if(this.user!=null||this.user!=undefined){
        this.chatRequest.sender=this.user.user.email;
      }
   }
  mapClicked(){
   this.setCurrentPosition();
     this.data=false;
  }
ionViewWillEnter() {
    this.setCurrentPosition();
  }
  

  ngOnInit() {  
    this.agmMap.triggerResize();
    this.searchControl = new FormControl();
    //set current position
    this.setCurrentPosition();
    this.loadAllTraders();
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {       
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.icon='assets/img/currentUserIcon.png';
          this.zoom = 16;
        });
      });
    });
  }
 
 //set current position

 public setCurrentPosition() {
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
  
 // click on marker and open tab in buttom



  clickedMarker(traderEmail){
   this.traderBtcValueAfterUpdate.email=traderEmail; 
   this.trderinfoGet.email=traderEmail;   
   this._setupService.getTraderInfo(this.trderinfoGet).subscribe((response)=>{   
    if(response.statusCode == 200){
       this.data=true;  
       if(response.data.length>0){
         this.tradersUpdate = response.data;       
         }
      } 
      else{
        let toast = this.toastCtrl.create({
                     message: response.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present(); 
      } 
    });
  }

// send request when click on marker and click in request button

  requestToTraders(recipientEmail){
  this.chatRequest.recipient=recipientEmail; 
  let loading = this.loadingCtrl.create({
       content: 'sending request...'
      }); 
     loading.present();
    this._setupService.sendRequest(this.chatRequest).subscribe((response)=>{
      loading.dismiss(); 
     if(response.statusCode==200){
      this.navCtrl.setRoot(ChatuserlistPage);
        let toast = this.toastCtrl.create({
                     message: response.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present(); 
              
     }else{
       let toast = this.toastCtrl.create({
                     message: response.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present(); 
     }
  })
  }


  // 
  loadAllTraders(){
    this.tradersMarker = [];
   this._setupService.getTradersLocation().subscribe((res) => {
   
     if (res) {      
       for(var traders of res.data){    
                this.tradersMarker.push({ 
                  lat: Number(traders.lat),
                  lng: Number(traders.long),  
                  title: traders.email, 
                  icon: 'assets/img/tradersIcon.png', 
                  draggable: false, })
            } 
          }
     });
  }


  ionViewWillLeave() {   
   this.io.socket.disconnect();
   delete this.io.sails;
  }
}

