import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {

  private baseUrl = environment.baseUrl;
    
  constructor(  
                private http : HttpClient,
                private router : Router,
              )
{ 
}




  getAllProposal( from : any=1, to : any = 200 ){
    return this.http.get<any>(`${this.baseUrl}api/proposal/getAllProposal?p=${from}&r=${to}`)
  .pipe(
    map( res =>{ 
          console.log('from service getAllProposal', res)
            return res} )
    );
  }

  getProposalById( id:any ){
    return this.http.get<any>(`${this.baseUrl}api/proposal/getProposalById/${id}`)
  .pipe(
    map( res =>{ 
          console.log('from service getProposalById', res)
            return res} )
    );
  }

  searchProposalByClient( query :  string ){
    return this.http.get<any>(`${this.baseUrl}api/proposal/searchProposal?querySearch=${query}`)
  .pipe(
    map( res =>{ 
          console.log('from service searchProposalByClient', res)
            return res} )
    );
  }

}
