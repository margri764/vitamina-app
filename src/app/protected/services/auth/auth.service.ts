import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, tap } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { environment } from 'src/environments/environment';
import * as authActions from 'src/app/auth.actions'
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../models/user.models';
import { ErrorService } from '../error/error.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { getDataLS } from '../../Storage';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  updateEditingUser$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  showLabelTempOrder$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  private labelSubject = new BehaviorSubject<string>(''); // Valor inicial vacío
  label$ = this.labelSubject.asObservable();

  updateLabel(newLabel: string) {
    this.labelSubject.next(newLabel);
  }

  token : string = '';
  user! : User;

  private baseUrl = environment.baseUrl;

  constructor(  
                private http : HttpClient,
                private store : Store <AppState>,
                private cookieService: CookieService,
                private localStorageService : LocalStorageService,
                private errorService : ErrorService,
                private router : Router
                // private dialog : MatDialog
              )
{ 
}




login(userName: string, password : string){
  const body = { userName, password
  }

  const now = new Date();
  const milisegundosPorSemana = 7 * 24 * 60 * 60 * 1000; 
  const expirationTime = new Date(now.getTime() + milisegundosPorSemana);

  return this.http.post<any>(`${this.baseUrl}api/login`, body) 
  
  .pipe(
    tap( ( {user, token, success}) =>{
                    if(success){
                        this.token = token;
                        this.cookieService.set('token',token, expirationTime);
                        this.user = user;
                        this.store.dispatch(authActions.setUser({user}));
                        const userToLS = { userName: user.userName}
                        this.localStorageService.saveStateToLocalStorage(userToLS, 'user');
                    }           
                  console.log("from login Service: ",token);
              }  
    ),            
    map( res => res )
  )
}


getToken(){
  return this.token
}

getCookieToken() {
  return this.cookieService.get('token');
}

getAllClients( ){


  return this.http.get<any>(`${this.baseUrl}api/agenda`)
.pipe(
  map( res =>{ 
        console.log('desde service getAllClients', res)
          return res} )
  );
}

getClientsPaginator(from : any, to : any){

    return this.http.get<any>(`${this.baseUrl}api/client/getAllClients?p=${from}&r=${to}`)
.pipe(
  map( res =>{ 
        console.log('desde service getClientsPaginator', res)
          return res} )
  );

}

updateClientById( body : any, id:any){
                                        
  return this.http.put<any>(`${this.baseUrl}api/client/${id}`, body)
.pipe(
  map( res =>{ 
        console.log('desde service updateClientById', res)
          return res} )
  );
}

deleteClientById( id:any){
                   id = "2737";                   
  return this.http.delete<any>(`${this.baseUrl}api/client(delete/${id}`)
.pipe(
  map( res =>{ 
        console.log('desde service deleteCulientById', res)
          return res} )
  );
}

addNewClient( body : User){


return this.http.post<any>(`${this.baseUrl}api/client`, body)
.pipe(
  map( res =>{ 
         console.log('desde service addNewClient', res)
  return res} )
  );
}

searchClientByName( query :  string ){
  return this.http.get<any>(`${this.baseUrl}api/client/searchClient?querySearch=${query}`)
.pipe(
  map( res =>{ 
        console.log('desde service searchClientByName', res)
          return res} )
  );
}

getClientById( id : any ){
  return this.http.get<any>(`${this.baseUrl}api/client/getClient${id}`)
.pipe(
  map( res =>{ 
        console.log('desde service getClientById', res)
          return res} )
  );
}

}