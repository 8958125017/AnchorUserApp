import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams,MenuController,ToastController,LoadingController,Events,Slides} from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { UserOptions,LoginDetail } from '../../interfaces/user-options';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { SignupPage } from '../signup/signup';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { GmapPage } from '../gmap/gmap';
import { SetupService } from '../../providers/setup.services';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../pages/login/login';
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})

export class TutorialPage {
  showSkip = true;

	@ViewChild('slides') slides: Slides;
   login1: UserOptions = { username: '', password: '' };
  loginDetail: LoginDetail = { email: '', password: '',lat:'', long:'' };
  responseData:any;
  public user:any;
  submitted = false;
  public userName:any;
  constructor(
    public userData: UserData,public navCtrl: NavController,public toastCtrl: ToastController,public events: Events,public menuCtrl: MenuController,
     public navParams: NavParams,public _setupService: SetupService,public loadingCtrl: LoadingController,
    public menu: MenuController,
    public storage: Storage
  ) { }

  startApp() {
    this.navCtrl.push(LoginPage).then(() => {
      this.storage.set('hasSeenTutorial', 'true');
    })
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  ionViewWillEnter() {
    this.slides.update();
  }

  ionViewDidEnter() {
       this.menu.enable(false);
  }
 

  ionViewDidLeave() {
      this.menu.enable(false);
  }

  login(){
    this.navCtrl.setRoot(LoginPage);
  }
  signup(){
     this.navCtrl.push(SignupPage);
  }
   public setCurrentPosition() {
      if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.loginDetail.lat = position.coords.latitude;
        this.loginDetail.long = position.coords.longitude;     
      });
    }
  }

  onlogin1(form: NgForm){
  this.submitted = true; 
  if (form.valid) {  
       this.userData.login(this.login1.username);   
        let loading = this.loadingCtrl.create({
       content: 'Logging please wait...'
      }); 
        loading.present();
       this._setupService.createLoginDetail(this.loginDetail).subscribe((result) => { 
          if(result.statusCode== 200){
            this.responseData = result;
           console.log("res = = "+JSON.stringify(this.responseData));
             localStorage.setItem('logindetail',JSON.stringify(this.responseData));
              this.user=JSON.parse(localStorage.getItem('logindetail'));            
             loading.dismiss();  
        this.navCtrl.setRoot(GmapPage);
      }else{
                     this.responseData = result;
                     loading.dismiss();
                     let toast = this.toastCtrl.create({
                     message: this.responseData.message,
                     showCloseButton: true,
                     closeButtonText: 'Ok',
                     duration: 5000
                });
                toast.present(); 
          } 
    });
    }
}

   onLogin(form: NgForm) {
    this.submitted = true; 
    if (form.valid) {  
      this.userData.login(this.login1.username); 
      this.userName=this.loginDetail.email;         
      this.events.publish("shareObject", this.userName);   
      this.storage.set('hasSeenTutorial', 'true');
       this.navCtrl.setRoot(GmapPage);
        
    }
  }
  
  onSignup() {
    this.navCtrl.push(SignupPage);
      this.storage.set('hasSeenTutorial', 'true');
  }
  forgotPassword(){
      this.navCtrl.push(ForgotpasswordPage);
        this.storage.set('hasSeenTutorial', 'true');
 }

}
