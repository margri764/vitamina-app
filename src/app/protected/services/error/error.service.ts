import { EventEmitter, Injectable } from '@angular/core';

import { LoginMessageComponent } from '../../messages/login-message/login-message/login-message.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, map, of, tap, throwError } from 'rxjs';
import * as authActions from 'src/app/auth.actions'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppState } from 'src/app/app.reducer';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import { ErrorBackendDownComponent } from '../../messages/error-backend-down/error-backend-down/error-backend-down.component';
import { Router } from '@angular/router';
import { getDataLS, getDataSS } from '../../Storage';
import { WrongActionMessageComponent } from '../../messages/wrong-action-message/wrong-action-message/wrong-action-message.component';
import { NoPermissionMessageComponent } from '../../messages/no-permission-message/no-permission-message/no-permission-message.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private baseUrl = environment.baseUrl;
  phone : boolean = false;
  
  height : string = '';
  width : string = '';
  isLoading$ = new BehaviorSubject<boolean>(false) //quiero a ce cierren todos los modals cuando se produce un error de servidor 
  close$ = new BehaviorSubject<boolean>(false) //quiero a ce cierren todos los modals cuando se produce un error de servidor 
  authDelTempOrder$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDelClient$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authContinueGenericSuccess$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  closeIsLoading$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  labelInvalidCredential$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  labelInvalidCode$ : EventEmitter<boolean> = new EventEmitter<boolean>; // en las
  loadAllOrders$ : EventEmitter<boolean> = new EventEmitter<boolean>; // en las
  authDelEmployee$: any;
  
  constructor(
              private dialog : MatDialog,
              private http : HttpClient,
              private store : Store <AppState>,
              private cookieService: CookieService,
              private router : Router

  ) { 
    this.checkDisplaysizes()
  }

  getError(error : any) {


    if (error.status === 401 && error.error.message === "Token expired") {
      localStorage.removeItem('logged');
      this.cookieService.delete('token');
      setTimeout(()=>{
        this.openDialogLogin();
      },500)
      
      
      // this.close$.next(true);
      // this.close$.next(false);
      // this.closeIsLoading$.emit(true);
      return of(null);
    }

    if (error.status === 401 && error.error.message === "Invalid Token") {
        this.logoutInvalidToken();
        this.openDialogLogin();
        this.close$.next(true);
        this.close$.next(false);
        this.closeIsLoading$.emit(true);
      return of(null);


    }


    if (error.status === 401) {
      this.logout();
      this.openDialogLogin();
      this.close$.next(true);
      this.close$.next(false);
      // this.closeIsLoading$.emit(true);
      return of(null);
    }


    
    if (error.status === 500) {
      this.openDialogBackendDown();
      this.closeIsLoading$.emit(true);
      return of(null);
    }

     if (error.status === 403 && error.error.message==="Credenciales invalidas." ) {
      this.closeIsLoading$.emit(true);
      this.labelInvalidCredential$.emit(true);
      return of(null);
    }

    if (error.status === 404 ) {
      this.closeIsLoading$.emit(true);
      this.openGenericMsgAlert('Internal Server Error. Sorry, something went wrong on our server. Please try again later')
      return of(null);
    }

        if (error.status === 400 && error.error.errors && Array.isArray(error.error.errors)) {
        const errors = error.error.errors;
        const errorMessages = errors.map((errorObj: any) => errorObj.msg);
        const errorMessage = errorMessages.join("\n");
        this.openGenericMsgAlert(errorMessage );
        return of(null);
      }

    

    if (error.status === 400) {
        this.openGenericMsgAlert(error.error.message);
        this.closeIsLoading$.emit(true);
        return of(null);
    }

 

    if (error.statusText === "Unknown Error" ) {
      this.closeIsLoading$.emit(true);
     
      this.openGenericMsgAlert('Internal Server Error. Sorry, something went wrong on our server. Please try again later')
      return of(null);
    }

    // Devuelve un observable que emite el error original
    return throwError(() => error);

  }

  logout(){
          sessionStorage.removeItem("token");
          this.close$.next(true);
          this.close$.next(false);
          localStorage.removeItem("logged");
          localStorage.removeItem("user");
          this.store.dispatch(authActions.unSetUser());
          this.store.dispatch(authActions.unSetClient());
          this.store.dispatch(authActions.unSetProjectSkills());
          this.store.dispatch(authActions.unSetEmployeeProjectTime());
          this.store.dispatch(authActions.unSetReviewedProject());
          this.router.navigateByUrl('login'); 
            
  }

  logoutInvalidToken(){
    sessionStorage.removeItem("token");
    this.close$.next(true);
    this.close$.next(false);
    localStorage.removeItem("logged");
    sessionStorage.removeItem("logged");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("openOrders");
    this.cookieService.delete('token');
    this.store.dispatch(authActions.unSetTempEmployee());
    this.store.dispatch(authActions.unSetUser());
    localStorage.removeItem('salePoint')
   //  setTimeout(()=>{location.reload()},100)
    this.router.navigateByUrl('login'); 
  }
  
  checkDisplaysizes(){

    if(screen.width >= 800) {
      this.width = "400px";
      this.height ="550px";
    }
  }


  openDialogLogin() {
    this.dialog.open(LoginMessageComponent,{
      width: `${this.width}`|| "",
      height:`${this.height}`|| "",
      panelClass:"custom-modalbox-message",
    });
  }

  openDialogBackendDown(){

    let width : string = '';
    let height : string = '';

    if(screen.width >= 800) {
      width = "350px"
      height ="450px";
    }
    this.dialog.open(ErrorBackendDownComponent,{
      width: `${this.width}`|| "",
      height:`${this.height}`|| "",
      panelClass:"custom-modalbox-message",
    });
  }

  openGenericMsgAlert(msg : string){

    let width : string = '';
    let height : string = '';

    if(screen.width >= 800) {
      width = "350px"
      height ="350px";
    }

    this.dialog.open(WrongActionMessageComponent, {
      data: msg,
      width: `${width}`|| "",
      height:`${height}`|| "",
      disableClose: true,
      panelClass:"custom-modalbox-NoMoreComponent", 
    });
  
  }

  openDialogNoAuth() {

    let width = '';
    let height = '';
    if(screen.width >= 800) {
      width = "400px";
      height ="550px";
    }

    this.dialog.open(NoPermissionMessageComponent,{
      width: `${width}`|| "",
      height:`${height}`|| "",
      panelClass:"custom-modalbox-message",
    });
  }
  
 }
