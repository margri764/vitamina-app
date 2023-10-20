import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as authAction from 'src/app/auth.actions'
import { getDataLS, getDataSS, saveDataLS, saveDataSS } from '../../Storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {


  constructor(
               private store: Store<AppState>,
               ) 
  {
    }

   loadInitialState() {
    const storedState = getDataSS("arrArticles");
    const openOrders = getDataSS("openOrders");
    const user = getDataLS("user");
    const tempUser = getDataSS("tempClient");
    //  console.log(openOrders);
    // console.log(storedState);

  
 
    if(user !== undefined && user !== null){
      this.store.dispatch(authAction.setUser({ user }));
    }

    if(tempUser !== undefined && tempUser !== null){
      this.store.dispatch(authAction.setTempClient({ client: tempUser }));
    }


 
  }

  saveStateToLocalStorage(dataToSave: any, keyLStorage : string) {
    saveDataLS(keyLStorage, dataToSave);
  }

  saveStateToSessionStorage(dataToSave: any, keyLStorage : string) {
    saveDataSS(keyLStorage, dataToSave);
  }


}