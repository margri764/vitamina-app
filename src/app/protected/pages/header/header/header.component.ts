import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, filter, take } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { OrderService } from 'src/app/protected/services/order/order.service';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { MantainMessageComponent } from 'src/app/protected/messages/maintain-message/mantain-message/mantain-message.component';
import { AskDontShowComponent } from 'src/app/protected/messages/ask-dont-show/ask-dont-show/ask-dont-show.component';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from 'src/app/protected/services/project/project.service';
import * as authActions from 'src/app/auth.actions';
import { GenericMessageComponent } from 'src/app/protected/messages/generic-message/generic-message/generic-message.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewChecked{

@Input() url : string =''
@Input() logeado : boolean = false;

  // accordion
  panelOpenState = false;
  showLabelTempOrder : boolean = false;
  articleSuscription!: Subscription;
  userSubscription!: Subscription;
  alert! : any;
  toogle : boolean = false;
  @ViewChild(MatAccordion)  accordion!: MatAccordion;
  hidden : boolean = false;
  login : boolean = false;
  // accordion
    
 labelHeader : string = '';
 path : string = '/home';
 user: any | undefined;
 donShowNotifications:boolean = false;
 reviewedProjects : any[]=[];

  constructor(
               private store : Store <AppState>,
               private errorService : ErrorService,
               private cdRef: ChangeDetectorRef,
               private location : Location,
               private router : Router,
               private authService : AuthService,
               private orderService : OrderService,
               private dialog : MatDialog,
               private projectService : ProjectService,
  ) { 
        
          
  }

  ngAfterViewChecked() {
    this.updateLabelHeader(this.url);
    this.login = this.logeado;
    // console.log(this.logeado);
    this.cdRef.detectChanges();
  }


  ngOnInit(): void {




 this.store.select('auth')
  .pipe(
    filter( ({user})=>  user != null && user != undefined),
  ).subscribe(
    ({user, reviewedProjects})=>{
      this.user = user;
      this.login = true;
      this.reviewedProjects = reviewedProjects;
      if(reviewedProjects.length === 0){
        this.alert;
      }else{
        this.alert = reviewedProjects.reduce((total: any, item: any ) => total + (item.notification === true), 0);
        
        if(this.alert === 0){
          this.alert = '';
        }else{
          this.alert
        }

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
          this.projectService.sendAdminNotification(project._id, "doNotShowNotification").subscribe( 
            ( {success} )=>{
              if(success){
                this.getReviewedProjects();
              }
            });
        }

      })
 }else{

  this.projectService.sendAdminNotification(project._id, "doNotShowNotification").subscribe( 
    ( {success} )=>{
      if(success){
        this.getReviewedProjects();
      }
    });

 }

 
}

getReviewedProjects(){
  this.projectService.getReviewedProjects().subscribe( 
    ( {success, projects})=>{
        if(success){
            this.store.dispatch(authActions.setReviewedProject( {reviewedProjects:projects} ))
        }
    })
}



 updateLabelHeader( url : string){
  this.donShowNotifications = false;

  if (url.startsWith('/view-employee')) {
   this.url = '/view-employee';
  }else if(url.startsWith('/view-project')){
    this.url = '/view-project';
  }else if(url.startsWith('/confirm-proposal')){
    this.url = '/confirm-proposal';
    this.donShowNotifications = true;
  }else if(url.startsWith('/review-proposal')){
    this.url = '/review-proposal';
    this.donShowNotifications = true;
  }else if(url.startsWith('/edit-project')){
    this.url = '/edit-project';

  }

  switch (url) {

    case '/client-list':
          this.labelHeader = "Clients";
      break;

    case '/view-employee':
            this.labelHeader = "Employee";
     break;  

    case '/view-project':
      this.labelHeader = "Project";
    break;  

    case '/edit-project':
      this.labelHeader = "Edit Project";
    break; 

    case '/employee-list':
            this.labelHeader = "Employees";
     break;  

    case '/projects-managment':
      this.labelHeader = "Project managment";
     break;  

    case '/confirm-proposal':
      this.labelHeader = "Confirm proposal";
     break;  

     case '/review-proposal':
      this.labelHeader = "Review proposal";
     break;  

    case '/create-project':
      this.labelHeader = "Create project";
     break;  

    case '/skills-managment':
      this.labelHeader = "Skills managment";
     break;  

    default:  this.labelHeader = "";
    break;
  }

  this.path = url;

 }

 navigate(){

   
  //  if (this.path.startsWith('/view-employee')) {
  //    this.url = '/view-employee';
  //   } 
    
    switch (this.path) {
      case '/view-employee':
      case'/view-project':  
                 
                  this.location.back()
       break;

       case '/review-proposal':
       case '/confirm-proposal':
                   
         break;
       
         
                 
          default: this.router.navigateByUrl('/home');
            break;
        }

 }

 visibility(){
  this.toogle = !this.toogle;
}

logout(){
  this.errorService.logout();
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


}
