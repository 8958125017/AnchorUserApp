import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { ConferenceApp } from './app.component';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { LoginPage } from '../pages/login/login';
import { ForgotpasswordPage} from '../pages/forgotpassword/forgotpassword';
import { SignupPage } from '../pages/signup/signup';
import { ChangepasswordPage } from '../pages/changepassword/changepassword';
import { ChatuserlistPage} from '../pages/chatuserlist/chatuserlist';
import { ChatroomPage} from '../pages/chatroom/chatroom';
import { GmapPage } from '../pages/gmap/gmap';
import { AgmCoreModule } from '@agm/core';
import { SetupService } from '../providers/setup.services';
import { SettingPage } from '../pages/setting/setting';
import { Geolocation } from '@ionic-native/geolocation';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

@NgModule({
  declarations: [
    ConferenceApp,
    TutorialPage,
    ChatuserlistPage,
    ChatroomPage,    
    LoginPage,
    ForgotpasswordPage,
    ChangepasswordPage,    
    GmapPage,   
    SignupPage,
    SettingPage,
 
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCS-JPv-UnylrjSuPAgTEolYkYhMBjOCvs',libraries: ["places"]
    }),
   
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: ForgotpasswordPage, name: 'ForgotpasswordPage', segment: 'forgotpassword' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: ChangepasswordPage, name: 'ChangepasswordPage', segment: 'changepassword' },
        { component: ChatuserlistPage, name: 'ChatuserlistPage', segment: 'Chatuserlist' },
        { component: ChatroomPage, name: 'ChatroomPage', segment: 'chatroom' },      
        { component: SettingPage, name: 'SettingPage', segment: 'setting' },      
        { component: GmapPage, name: 'Gmap', segment: 'gmap' },       
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    TutorialPage,
    ChatuserlistPage,
    ChatroomPage,  
    LoginPage,
    ForgotpasswordPage,
    ChangepasswordPage,   
    GmapPage, 
    SettingPage,
    SignupPage,  
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData,Geolocation,
    UserData,SetupService,StatusBar,
    InAppBrowser,
    SplashScreen
  ]
})
export class AppModule { }
