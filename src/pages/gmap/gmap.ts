import { AgmMap,AgmCoreModule, MapsAPILoader } from '@agm/core';
import {  NavController,Platform, NavParams,LoadingController } from 'ionic-angular';
import { Component, ElementRef,  NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Markers,ChatRequest,TrderinfoGet,updateValue } from '../../interfaces/user-options';
import { } from 'googlemaps';
import { SetupService } from '../../providers/setup.services'; 
import { Storage } from '@ionic/storage';
import { UserData } from '../../providers/user-data';
import { Geolocation } from '@ionic-native/geolocation';
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
   public searchElementRef: ElementRef;
   @ViewChild(AgmMap)
  public agmMap: AgmMap
  
  public tradersMarker: Markers[];
  public currentUserMarkers: Markers[];
  public latitude: number;
  public longitude: number;
  public zoom: number;
  public icon:any;
  public searchControl: FormControl;
  public userData:any=[];
  public data:boolean;
  public name:string;
  public user:any;
  public useremail:boolean;
  public responseData:any;
  public chatRequest: ChatRequest = { sender: '', recipient: '' };
  public trderinfoGet: TrderinfoGet = { email: '', currency: '' };
  public traderinfoAfterGet: updateValue = { email: '', "buyRate": '', "sellRate": '',"volume":"" };
  constructor(private geolocation: Geolocation,public platform: Platform,public loadingCtrl: LoadingController,public storage: Storage,private mapsAPILoader: MapsAPILoader,public _setupService: SetupService, private ngZone: NgZone ) 
   {
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
   }
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

  clickedMarker(a){
    this.data=true;   
    console.log("b = = = "+a);
    this.name=a;  
  }

  clickedMarkerForGetTrdersinformation(a){
    this.trderinfoGet.email=a;
    this.trderinfoGet.email="BTC";
    this._setupService.getTraderInfo(this.trderinfoGet).subscribe((response)=>{
    this.data=true;   
    var responseTraderData=response;
      this.traderinfoAfterGet.email=response.email;
       this.traderinfoAfterGet.buyRate=response.buyRate;
       this.traderinfoAfterGet.sellRate=response.sellRate;
       this.traderinfoAfterGet.volume=response.volume;
  });
     
     
  }

// send request when click on marker and click in request button

  requestToTraders(b){
  this.chatRequest.recipient=b; 
  let loading = this.loadingCtrl.create({
       content: 'sending request...'
      }); 
     loading.present();
    this._setupService.sendRequest(this.chatRequest).subscribe((response)=>{
      loading.dismiss(); 
     if(response.statusCode==200){
       this.responseData=response.message;       
     }else{
       alert("error");
     }
  })
  }


  // 
  loadAllTraders(){
    this.tradersMarker = [];
   this._setupService.getTradersLocation().subscribe((res) => {
     console.log("res = = "+JSON.stringify(res));
     if (res) {    
  
       for(var traders of res.data){    

                this.tradersMarker.push({ lat: Number(traders.lat),
                 lng: Number(traders.long),  
                 title: traders.email, 
                 icon: 'assets/img/tradersIcon.png', 
                 draggable: false, })
            } 
          }
     });
  }
}

