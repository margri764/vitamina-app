import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, map, tap, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { getDataLS } from '../../Storage';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  initialStateAfterEditOrder$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  updateEditingArticle$ : EventEmitter<any> = new EventEmitter<any>; 
  updateAllArticle$ : EventEmitter<any> = new EventEmitter<any>; 


  token : string = '';
  // user : User | undefined;
  private baseUrl = environment.baseUrl;

  constructor(  private http : HttpClient,
                // private store : Store <AppState>,
                // private dialog : MatDialog
              )
{ 
  this.baseUrl = getDataLS('baseUrl') || environment.baseUrl;
}

setBaseUrl(newUrl: string) {
  this.baseUrl = newUrl;
}

getAllArticles(from : any, to : any){
    return this.http.get<any>(`${this.baseUrl}api/articulos?p=${from}&r=${to}`) 
    .pipe(
      tap( (res)=>{console.log('desde getAllArticles: ', res)}),
      map( res =>  res )
    )
}

getArticleById(id : string){
  return this.http.get<any>(`${this.baseUrl}api/articulos/${id}`) 
    
  .pipe(
    tap( res =>{
                    // if(token){
                    //     this.token = token
                    // }           
                  console.log("desde login Service: ",res);
              }  
    ),            
    map( res => res )
  )
}

searchArticle( field : string, value : any) {

  return this.http.get<any>(`${this.baseUrl}api/articulos/busqueda?f=${field}&q=${value}`)
  .pipe(
    map( res =>{ 
          console.log('desde service searchArticle', res)
            return res} )
    );
}

searchArticleById( id : any){
  return this.http.get<any>(`${this.baseUrl}api/articulos/${id}`)
  .pipe(
    map( res =>{ 
          console.log('desde service searchProductById', res)
            return res} )
    );
}

editArticleById( body: any, codigo_interno : string){
  return this.http.put<any>(`${this.baseUrl}api/articulos/${codigo_interno}`, body)
.pipe(
  map( res =>{ 
        console.log('desde service searchProductById', res)
          return res} )
  );
}

createNewArticle( body: any){
  return this.http.post<any>(`${this.baseUrl}api/articulos`, body)
.pipe(
  map( res =>{ 
        console.log('desde service createNewArticle', res)
          return res} )
  );
}

getAllTruePriceList( ){
  return this.http.get<any>(`${this.baseUrl}api/precios`)
  .pipe(
    map( res =>{ 
          console.log('desde service getAllTruePriceList', res)
            return res} )
    );
}

getPriceListById( id:any, from : any, to : any ){
  return this.http.get<any>(`${this.baseUrl}api/precios/${id}?p=${from}&r=${to}`)
.pipe(
  map( res =>{ 
        console.log('desde service getPriceListById', res)
          return res} )
  );

}

getArtListPriceByDesc( idListaPrecios : any, value : string ){

  console.log(idListaPrecios, value);
  return this.http.get<any>(`${this.baseUrl}api/precios/${idListaPrecios}/busqueda/${value}`)
.pipe(
  map( res =>{ 
        console.log('desde service getArtListPriceByDesc', res)
          return res} )
  );

}

getArtListPriceByCode( idListaPrecios : any, codeInt : any ){

  console.log(idListaPrecios, codeInt);
  const code = 'codigo';
  let tempCode = codeInt.toString()
  return this.http.get<any>(`${this.baseUrl}api/precios/${idListaPrecios}/${code}/${tempCode}`)
.pipe(
  map( res =>{ 
        console.log('desde service getArtListPriceByCode', res)
          return res} )
  );

}






}