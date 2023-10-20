import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { getDataLS } from '../../Storage';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  changeClientValue : EventEmitter<boolean> = new EventEmitter<boolean>; // se dispara desde el back de buscar-articulos para q volver a "Productos"
  selectProductOption$ : EventEmitter<boolean> = new EventEmitter<boolean>; // se dispara desde el buscar-articulos para q volver a "Productos" en /armar-pedido y q no muestre a "Cliente" como esta predeterminado
  emitedItem$ :  EventEmitter<any> = new EventEmitter; // emito desd el add-item un nuevo item se agrega en el edit de los pedidos
  cancelOrNextOpenOrder$ :  EventEmitter<any> = new EventEmitter; // sid ejo una orden abierta, la puedo eleiminar tambien
  cancelOrNextSendOrder$ :  EventEmitter<any> = new EventEmitter; // desde el tempOrder pregunto si quiere enviar la orden
  private baseUrl = environment.baseUrl;

  constructor(  private http : HttpClient,
                private store : Store <AppState>,
                 private localStorageService: LocalStorageService,

                // private cookieService: CookieService
                // private dialog : MatDialog
              )
{ 
  console.log('desde order');
  this.baseUrl = getDataLS('baseUrl') || environment.baseUrl;
}


setBaseUrl(newUrl: string) {
  this.baseUrl = newUrl;
}

createOrder(order:any){

  console.log(order);

    return this.http.post<any>(`${this.baseUrl}api/pedidos`, order)
  .pipe(
    map( res =>{ 
          console.log('desde service createOrder', res)
            return res} )
    );
  
}

updateOrderState( salePoint : any, nroOrder : any, state : string){
  const emptyBody = {}
  return this.http.put<any>(`${this.baseUrl}api/pedidos/estado/${salePoint}/${nroOrder}?e=${state}`, emptyBody)
.pipe(
  map( res =>{ 
        console.log('desde service updateOrderState', res)
          return res} )
  );

}

getSalePoint(){

  return this.http.get<any>(`${this.baseUrl}api/pedidos/pos`)
  .pipe(
    map( res =>{ 
          console.log('desde service getSalePoint', res)
            return res} )
    );
}

condicionesIva(){
  return this.http.get<any>(`${this.baseUrl}api/general/condicionesiva`)
  .pipe(
    map( res =>{ 
          console.log('desde service condicionesIva', res)
          return res  })
    )

}

getDniOption(){
  return this.http.get<any>(`${this.baseUrl}api/general/tiposdoc`)
  .pipe(
    map( res =>{ 
          console.log('desde service getDniOption', res)
          return res  })
    )
}

getOpenOrders(){

  return this.http.get<any>(`${this.baseUrl}api/pedidos/abiertos`)
  .pipe(
    tap( ({pedidos})=>{
                if(pedidos.length !== 0){
                  this.localStorageService.saveStateToSessionStorage(pedidos, 'openOrders');
                }else{
                  sessionStorage.removeItem('openOrders')
                  // this.localStorageService.saveStateToSessionStorage(undefined, 'openOrders');
                }
      
    }),
    map( res =>{ 
          console.log('desde service getOpenOrders', res)
            return res} )
    );
}

getAllOrders( ){
  return this.http.get<any>(`${this.baseUrl}api/pedidos`)
.pipe(
  map( res =>{ 
        console.log('desde service getAllOrders', res);
          return res} )
  );
}

getDailyOrders( day : string){
  return this.http.get<any>(`${this.baseUrl}api/pedidos/realizados?d=${day}`)
.pipe(
  map( res =>{ 
        console.log('desde service getDailyOrders', res);
          return res} )
  );
}

getOrdersByPtoVenta( id :  any, from : any, to : any){

  return this.http.get<any>(`${this.baseUrl}api/pedidos/${id}?p=${from}&r=${to}`)
.pipe(
  map( res =>{ 
        console.log('desde service getOrdersByPtoVenta', res)
          return res} )
  );
}

getSalePointByNumOrder( salePoint :  any, nroOrder : any ){
  return this.http.get<any>(`${this.baseUrl}api/pedidos/${salePoint}/${nroOrder}`)
  .pipe(
    map( res =>{ 
      console.log('desde service getSalePointByNumOrder', res)
      return res} )
      );
}

editOrderBySalePointAndNumOrder( body:any, salePoint : any, nroOrder : any){
console.log(body);
  return this.http.put<any>(`${this.baseUrl}api/pedidos/${salePoint}/${nroOrder}`, body)
.pipe(
  map( res =>{ 
              
        console.log('desde service editOrderBySalePointAndNumOrder', res)
          return res} )
  );
}


// getOrdersPaginator(from : any, to : any ){

//   return this.http.get<any>(`${this.baseUrl}api/pedidos?p=${from}&r=${to}`)
// .pipe(
//   map( res =>{ 
//         console.log('desde service getOrdersPaginator', res)
//           return res} )
//   );
// }

}
