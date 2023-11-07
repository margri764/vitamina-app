import { Component, HostListener, OnInit, Output } from '@angular/core';
import { AuthService } from './protected/services/auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { AppState } from './app.reducer';
import { OrderService } from './protected/services/order/order.service';
import { Store } from '@ngrx/store';
import * as authActions from './auth.actions';
import { LocalStorageService } from './protected/services/localStorage/local-storage.service';
import { getDataLS, getDataSS, saveDataLS } from './protected/Storage';
import { CookieService } from 'ngx-cookie-service';
import { distinctUntilChanged, filter, tap } from 'rxjs';
import { User } from './protected/models/user.models';
import { ErrorService } from './protected/services/error/error.service';
import { ProjectService } from './protected/services/project/project.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'practigestion-app';
  @Output () currentUrl : any = '';
  @Output () login : boolean = false;

   isLoading : boolean = false;
   user : any;
   phone : boolean = false;


  constructor(
              private localStorageService: LocalStorageService,
              public router : Router,
              private store : Store <AppState>,
              private orderService : OrderService,
              private cookieService : CookieService,
              private authService : AuthService,
              private errorService : ErrorService,
              private projectService : ProjectService

  ){

    const token = this.cookieService.get('token');
    const userLS = getDataLS('user');
    const logged = getDataLS("logged"); 
    const loggedSS = getDataSS("logged"); 

    if(token !== '' && userLS === undefined){
      this.router.navigateByUrl('/login');
    }

    if(logged === undefined && loggedSS === undefined ){
      this.router.navigateByUrl('/login');
    }

    (screen.width <= 800) ? this.phone = true : this.phone = false;

  }

  ngOnInit(): void {

   this.localStorageService.loadInitialState();

    
   this.errorService.closeIsLoading$.subscribe((emmited)=>{if(emmited){this.isLoading = false}})
  
    this.store.select('auth')
    .pipe(
      // tap(()=>this.isLoading = true),
      filter( ({user})=>  user != null && user != undefined),
      distinctUntilChanged((prev, curr) => prev.user === curr.user)
    ).subscribe(
      ({user})=>{
        this.user = { nombre:user?.nombre, permisos:user?.permisos} ;
        this.isLoading = false;
        this.getReviewedProjects();
      })
  

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
   
      }
    });


  }

  getReviewedProjects(){
    console.log('aa');
    this.projectService.getReviewedProjects().subscribe( 
      ( {success, projects})=>{
          if(success){
              this.store.dispatch(authActions.setReviewedProject( {reviewedProjects:projects} ))
          }
      })
  }




}
