import { AfterViewChecked, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { OrderService } from 'src/app/protected/services/order/order.service';

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

  constructor(
               private store : Store <AppState>,
               private errorService : ErrorService,
               private cdRef: ChangeDetectorRef,
               private location : Location,
               private router : Router,
               private orderService : OrderService
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
    ({user})=>{
      this.user = user;
      this.login = true;
    })


    
 }

 updateLabelHeader( url : string){

  if (url.startsWith('/view-employee')) {
   this.url = '/view-employee';
  }else if(url.startsWith('/view-project')){
    this.url = '/view-project';
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

    case '/employee-list':
            this.labelHeader = "Employees";
     break;  

    case '/projects-managment':
      this.labelHeader = "Project managment";
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

   
   if (this.path.startsWith('/view-employee')) {
     this.url = '/view-employee';
    } 
    
    switch (this.path) {
      case '/view-employee':
      case'/view-project':  
                 
                  this.location.back()
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

}
