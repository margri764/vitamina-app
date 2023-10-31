import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  @Injectable({
    providedIn: 'root'
  })
  
      private baseUrl = environment.baseUrl;
    
      constructor(  
                    private http : HttpClient,
                    // private store : Store <AppState>,
                    private router : Router,
                  )
    { 
    }

    getAllProjects( from : any, to : any ){
      return this.http.get<any>(`${this.baseUrl}api/project/getAllProjects?p=${from}&r=${to}`)
    .pipe(
      map( res =>{ 
            console.log('from service getAllProjects', res)
              return res} )
      );
    }

    searchProjectByClient( query :  string ){
      return this.http.get<any>(`${this.baseUrl}api/project/searchProject?querySearch=${query}`)
    .pipe(
      map( res =>{ 
            console.log('from service searchProjectByClient', res)
              return res} )
      );
    }
    
  
  
  }