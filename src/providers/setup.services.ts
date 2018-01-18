import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SetupService {

  constructor(public http: Http) {
    this.http = http;    
   // console.log('Hello ServicesProvider Provider');
  }
       
       //endpoint_url: string = 'http://192.168.1.20:3000';
      endpoint_url : string = 'http://198.187.28.200:3000'; 

   //create new user account
    createUserAccount(SignUpDetail: any) {      
        var response = this.http.post(this.endpoint_url + '/user/createNewUser',SignUpDetail ).map(res => res.json());
        return response;
    }

     // verify email
     VerificationEmail(otpDetail: any) {      
        var response = this.http.post(this.endpoint_url + '/user/verifyEmailAddress',otpDetail ).map(res => res.json());
        return response;
    }

     // create login
      createLoginDetail(loginDetail: any) {  
     // alert("loginDetail = = "+JSON.stringfy(loginDetail));         
        var response = this.http.post(this.endpoint_url + '/user/login',loginDetail ).map(res => res.json());
        return response;
    }

      //get all traders list
        getAllTrader(){
          var response = this.http.get(this.endpoint_url +'/trader/getAllTrader').map(res => res.json());
          return response;
         }

      // send freiend request
        sendRequest(chatUser:any){
        // alert("user detail = = "+chatUser);
         var response = this.http.post(this.endpoint_url +'/chat/createChat',chatUser).map(res => res.json());
         return response;
        }

        // sendRequest(chatUser:any){
        // alert("user detail = = "+this.endpoint_url);
        //  var response = this.http.post(this.endpoint_url+'/chat/createChat',chatUser).map(res => res.json());
        //  return response;
        // }
      
      //update  Acceptance

        updateAcceptance(userId:any){
        //alert("chatUser ==  "+JSON.stringify(userId));
         var response = this.http.get(this.endpoint_url +'/chat/updateAcceptance',userId).map(res => res.json());
         return response;
       }
       
       //get friends list
        getfrienlist(emailId:any){
         var response = this.http.post(this.endpoint_url +'/chat/getUserFriends',emailId).map(res => res.json());
         return response;
        }

      // get chat messages

       getChatMessages(chatId:any){        
         var response = this.http.post(this.endpoint_url +'/chat/getChatMessages',chatId).map(res => res.json());
         return response;
       }

       //send message to traders

       sendMessage(messageDetail:any){        
         var response = this.http.post(this.endpoint_url +'/chat/sendMessage',messageDetail).map(res => res.json());
         return response;
       }
       

      // get hard code data
        getUserDetails(){
          var response = this.http.get('assets/data/userData.json').map(res => res.json());
          return response;
        } 
        // get hard code data
        getTradersLocation(){
          // var response = this.http.get('assets/data/tradersLocation.json').map(res => res.json());
          // return response;
          var response = this.http.get(this.endpoint_url +'/trader/getTradersByLocation').map(res => res.json());
         return response;
        }  
        getTraderInfo (emailId:any){        
          var response = this.http.post(this.endpoint_url +'/trader/getTraderInfo',emailId).map(res => res.json());
         return response;
        }

    
         // get hard code frienlist 
        getOldMessage(){
         var response = this.http.get('assets/data/messages.json').map(res => res.json());
         return response;
        } 

    // get hard code frienlist 
        getcurrentMessage(){
         var response = this.http.get('assets/data/currentMessage.json').map(res => res.json());
         return response;
        } 
       

        getUserChats(emailId:any){
         var response = this.http.get(this.endpoint_url +'/chat/getUserChats',emailId).map(res => res.json());
         return response;
       }

        forgotPassword(userDetail: any) {
        var response = this.http.post(this.endpoint_url + '/user/sentOtpToEmailForgotPassword',userDetail ).map(res => res.json());
        return response;
        }

       forgotPasswordOTP(otp: any) {
          var response = this.http.post(this.endpoint_url + '/user/verifyOtpToEmailForgotPassord',otp ).map(res => res.json());
          return response;
       }

       updateForgotPassord(newpasswordvalues: any) {
         var response =this.http.post(this.endpoint_url +'/user/updateForgotPassordAfterVerify',newpasswordvalues).map(res =>res.json());
         return response;
      }
       acceptRequest(isAccepted: any){
         var response =this.http.post(this.endpoint_url +'/chat/updateAcceptance',isAccepted).map(res =>res.json());
         return response;
       }

       rejectRequest(isAccepted: any){
         var response =this.http.post(this.endpoint_url +'/chat/updateAcceptance',isAccepted).map(res =>res.json());
         return response;
       }

       getTraderLastUpdatedValue(emailId:any){
          var response =this.http.post(this.endpoint_url +'/chat/updateAcceptance',emailId).map(res =>res.json());
         return response;

       }

       // update current passeword
    changecurrentpasswords(values:any){
     var response =this.http.post(this.endpoint_url +'/user/updateCurrentPassword',values).map(res =>res.json());
      return response;
    }
    //sent Otp To Email Verificatation
     EmailVerifyforAccount(email:any){
       console.log("email = = "+JSON.stringify(email));
          var response =this.http.post(this.endpoint_url +'/user/sentOtpToEmailVerificatation',email).map(res =>res.json());
          return response;
       } 
}


