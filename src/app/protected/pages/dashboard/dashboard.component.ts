import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Router } from '@angular/router';
import { filter, Subscription, take } from 'rxjs';
import { MatAccordion } from '@angular/material/expansion';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as authActions from 'src/app/auth.actions';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.models';
import { getDataLS, getDataSS } from '../../Storage';
import { CookieService } from 'ngx-cookie-service';
import { ErrorService } from '../../services/error/error.service';
import { OrderService } from '../../services/order/order.service';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { GenericMessageComponent } from '../../messages/generic-message/generic-message/generic-message.component';
import { MatDialog } from '@angular/material/dialog';
import { MantainMessageComponent } from '../../messages/maintain-message/mantain-message/mantain-message.component';
import { ProjectService } from '../../services/project/project.service';
import { AskDontShowComponent } from '../../messages/ask-dont-show/ask-dont-show/ask-dont-show.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {

@ViewChild(MatAccordion)  accordion!: MatAccordion;

userSubscription!:Subscription;
articleSuscription!:Subscription;
user: any | undefined;
tempOrder : any []=[];
toogle : boolean = false;
hidden : boolean = false;
showLabelTempOrder : boolean = false;
qrData: string = '';
// orders : any [] = [];
alert! : any;
showNoProcessMessage : boolean = false;
notificationsDone! : boolean;
login : boolean = false;
phone : boolean = false;
isLoading : boolean = false;
cookie : boolean= false;
dontShowNotifications: boolean = false;
reviewedProjects : any[]=[];

constructor(
              private store : Store <AppState>,
              private cookieService : CookieService,
              private errorService : ErrorService,
              private dialog : MatDialog,
              private projectService : ProjectService,
              private router : Router,
              private authService : AuthService,
              private orderService : OrderService,
              private localStorageService : LocalStorageService
  ) { 

    const token = this.cookieService.get('token');
    const logged = getDataLS("logged") 

    // const openOrders = getDataSS('openOrders');
    if(  logged == undefined || token !== ''){
      // this.router.navigateByUrl('/login')
    }

    (screen.width <= 600) ? this.phone = true : this.phone = false;

  }

visibility(){
    this.toogle = !this.toogle
}


ngOnInit(): void {
  this.checkSessionStorage();
  this.userSubscription = this.store.select('auth')
  .pipe(
    filter( ({user})=>  user != null && user != undefined),
  ).subscribe(
    ({user, reviewedProjects})=>{
      this.user = user;
      this.login = true;
      this.isLoading = false;
      this.reviewedProjects = reviewedProjects;
      if(reviewedProjects.length === 0){
        this.alert;
      }else{
        this.alert = reviewedProjects.length;

      }
    })

  
}

checkSessionStorage(){

//   this.orderService.cancelOrNextOpenOrder$.subscribe(
//     (emmited)=>{
//       if(emmited){

//       }
//     })

}

getReviewedProjects(){
  this.projectService.getReviewedProjects().subscribe( 
    ( {success, projects})=>{
        if(success){
            this.store.dispatch(authActions.setReviewedProject( {reviewedProjects:projects} ))
        }
    })
}

notification( project:any, action:string){

  if(action === 'dontShow'){
   
      this.openAskDonShow();
  
      this.projectService.authDontShowAgain$.pipe(
        take(1)
      ).subscribe( (auth: any)=> {

        if(auth){
          this.projectService.sendAdminNotification(project._id, "acceptNotification").subscribe( 
            ( {success} )=>{
              if(success){
                this.getReviewedProjects();
              }
            });
        }

      })
 }else{

  this.projectService.sendAdminNotification(project._id, "acceptNotification").subscribe( 
    ( {success} )=>{
      if(success){
        this.getReviewedProjects();
      }
    });

 }


 
}




openGenericMessage(msg:string){
  let width : string = '';
  let height : string = '';

  if(screen.width >= 800) {
    width = "400px"
    height ="450px";
  }


  this.dialog.open(GenericMessageComponent, {
    width: `${width}`|| "",
    height:`${height}`|| "",
    data: msg,
    panelClass:"custom-modalbox-NoMoreComponent", 
  });
}

openMantainMessage(){
  let width : string = '';
  let height : string = '';

  if(screen.width >= 800) {
    width = "400px"
    height ="450px";
  }

  this.dialog.open(MantainMessageComponent, {
    width: `${width}`|| "",
    height:`${height}`|| "",
    panelClass:"custom-modalbox-NoMoreComponent", 
  });

}

openAskDonShow(){
  let width : string = '';
  let height : string = '';

   if(screen.width >= 800) {
      width = "400px";
      height = "280px";
  
    }
      this.dialog.open(AskDontShowComponent, {
        disableClose: true,
        width: `${width}`|| "",
        height:`${height}`|| "",
        panelClass:"custom-modalbox-edit",
      });

}

logout() {
    this.errorService.logout();
}

ngOnDestroy(): void {

}


}