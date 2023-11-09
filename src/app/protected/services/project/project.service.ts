import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../../interfaces/project';

type StringArray = string[];


@Injectable({
  providedIn: 'root'
})


export class ProjectService {


  @Injectable({
    providedIn: 'root'
  })

  emitSuccessProject$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authSendProposal$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  authDontShowAgain$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  closeClientFeedback$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  projectSkillsRevProj$ : EventEmitter<StringArray> = new EventEmitter<StringArray>; 
  
      private baseUrl = environment.baseUrl;
    
      constructor(  
                    private http : HttpClient,
                    // private store : Store <AppState>,
                    private router : Router,
                  )
    { 
    }

    createProject( body : Project, action:string ){

      return this.http.post<any>(`${this.baseUrl}api/project/createProject?action=${action}`, body)
    .pipe(
      map( res =>{ 
            console.log('from service createProject', res)
              return res} )
      );
    }

    getAllProjects( from : any=1, to : any = 200){
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

    getProjectById( id:any ){
      return this.http.get<any>(`${this.baseUrl}api/project/getProject/${id}`)
    .pipe(
      map( res =>{ 
            console.log('from service getProjectById', res)
              return res} )
      );
    }

    sendProposal( id:any, action:string ){

      return this.http.post<any>(`${this.baseUrl}api/proposal/createProposal/${id}?action=${action}`, null)
    .pipe(
      map( res =>{ 
            console.log('from service sendProposal', res)
              return res} )
      );
    }
    

    setProjectState( projectId:any, state:string ){

      return this.http.patch<any>(`${this.baseUrl}api/project/projectState/${projectId}?state=${state}`, null)
    .pipe(
      map( res =>{ 
            console.log('from service projectState', res)
              return res} )
      );
    }

    clientReview( body:any, projectId:any, update:string ){

    return this.http.put<any>(`${this.baseUrl}api/project/updateProject/${projectId}?update=${update}`, body)
    .pipe(
      map( res =>{ 
            console.log('from service clientReview', res)
              return res} )
      );
    }

    sendAdminNotification( projectId:any, notification:string ){
      console.log(projectId, notification);

    return this.http.post<any>(`${this.baseUrl}api/project/adminNotification/${projectId}?notification=${notification}`, null)
    .pipe(
      map( res =>{ 
            console.log('from service sendAdminNotification', res)
              return res} )
      );
    }


    getReviewedProjects( from : any=1, to : any = 200){
      return this.http.get<any>(`${this.baseUrl}api/project/getReviewedProjects?p=${from}&r=${to}`)
    .pipe(
      map( res =>{ 
            console.log('from service getReviewedProjects', res)
              return res} )
      );
    }




    
  
  
  }