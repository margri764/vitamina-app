import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { getDataLS, getDataSS, saveDataLS, saveDataSS } from 'src/app/protected/Storage';
import { CookieService } from 'ngx-cookie-service';
import { OrderService } from 'src/app/protected/services/order/order.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import * as authActions from 'src/app/auth.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  myForm!: FormGroup;
  bannerStatus: boolean = false;
  uiSubscription!: Subscription;
  userSubscription! : Subscription;
  disabled = true;
  lstorageSelected: string = "true";
  path : string = ''
  user : any ;
  isuserValidated : boolean = false;
  passwordError: string = '';
  passwordVisible = false;
  snapshot : boolean = false;
  isLoading : boolean = false;
  confirm : boolean = false;
  cookie : boolean = false;
  showLabelInvalidCredential : boolean = false;


    constructor( 
                 private fb: FormBuilder,
                 private authservice : AuthService,
                 private router: Router,
                 private errorService : ErrorService,
                 private cookieService : CookieService,
                )
  {
    const token = this.cookieService.get('token');
    const logged = getDataLS('logged')

    if ( (token !== '') && logged) {
      this.router.navigateByUrl('/home')
    }
        

  }

ngOnInit() {

  this.errorService.labelInvalidCredential$.subscribe((emmited)=>{if(emmited){this.showLabelInvalidCredential = true; this.isLoading = false}});
  this.errorService.closeIsLoading$.emit(true); //esto lo tengo para cerrar el isLoading del app q lo tengo para los hard reload
  this.errorService.closeIsLoading$.subscribe((emmited)=>{if(emmited){this.isLoading = false }});
  
  this.myForm = this.fb.group({

    user:     [ 'admin', [Validators.required] ],
    password:  [ '11111111111a', [Validators.required]],
    toLStorage: [ true ], 
  });
  
}

 onSaveForm(){

        if ( this.myForm.invalid ) {
          this.myForm.markAllAsTouched();
          return;
        }
        this.showLabelInvalidCredential = false;
        this.isLoading = true;
        this.confirm = true;
        const username = this.myForm.get('user')?.value;
        const password = this.myForm.get('password')?.value;
        this.authservice.login(username, password).subscribe(
          ({token})=>{
              if(token){
                      
                      if(this.myForm.get('toLStorage')?.value === true){
                        saveDataLS('logged', true);
                      }else{
                        saveDataSS('logged', true);
                      }

                      this.isLoading=false;
                      this.router.navigateByUrl('/home');}});

 }  



validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}


togglePasswordVisibility(value : string) : void {
  (value == "password") ? this.passwordVisible = !this.passwordVisible : '';
}

ngOnDestroy(): void {
  
  if(this.userSubscription){ 
    this.userSubscription.unsubscribe();
  }
}
  
}