import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

    updateEditingEmployee$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
    authDelSkill$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
    authDelEmployee$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
    askNoAvailableEmployee$ : EventEmitter<boolean> = new EventEmitter<boolean>; 
  

  
    // token : string = '';
    employee! : any;
  
    private baseUrl = environment.baseUrl;
  
    constructor(  
                  private http : HttpClient,
                  // private store : Store <AppState>,
                  private router : Router,
                )
  { 
  }
  
  getEmployeeById( id : any ){
    return this.http.get<any>(`${this.baseUrl}api/employee/getEmployee/${id}`)
  .pipe(
    map( res =>{ 
          console.log('from service getEmployeeById', res)
            return res} )
    );
  }

  getEmployeeProjects( id : any ){
    return this.http.get<any>(`${this.baseUrl}api/employee/getEmployeeProjects/${id}`)
  .pipe(
    map( res =>{ 
          console.log('from service getEmployeeProjects', res)
            return res} )
    );
  }


  
  getAllEmployees( from : any, to : any ){
    return this.http.get<any>(`${this.baseUrl}api/employee/getAllEmployees?p=${from}&r=${to}`)
  .pipe(
    map( res =>{ 
          console.log('from service getAllEmployees', res)
            return res} )
    );
  }
  
  
  updateEmployeeById( body : any, id:any){
                                          
    return this.http.put<any>(`${this.baseUrl}api/employee/updateEmployee/${id}`, body)
  .pipe(
    map( res =>{ 
          console.log('from service updateEmployeeById', res)
            return res} )
    );
  }

  updateEmployeeSkill( body : any, id:any){
                                          
    return this.http.patch<any>(`${this.baseUrl}api/skill/updateSkill/${id}`, body)
  .pipe(
    map( res =>{ 
          console.log('from service updateEmployeeSkill', res)
            return res} )
    );
  }



  
  deleteEmployeeById( id:string, body:any){
    return this.http.patch<any>(`${this.baseUrl}api/employee/deleteEmployee/${id}`, body)
  .pipe(
    map( res =>{ 
          console.log('from service deleteEmployeeById', res)
            return res} )
    );
  }
  
  addNewEmployee( body : any){
  
  return this.http.post<any>(`${this.baseUrl}api/employee/createEmployee`, body)
  .pipe(
    map( res =>{ 
           console.log('from service addNewEmployee', res)
    return res} )
    );
  }
  
  searchEmployeeByName( query :  string ){
    return this.http.get<any>(`${this.baseUrl}api/employee/searchEmployee?querySearch=${query}`)
  .pipe(
    map( res =>{ 
          console.log('from service searchEmployeeByName', res)
            return res} )
    );
  }

  searchSkillByName( query :  string ){
    return this.http.get<any>(`${this.baseUrl}api/skill/searchSkill?querySearch=${query}`)
  .pipe(
    map( res =>{ 
          console.log('from service searchSkillByName', res)
            return res} )
    );
  }

  getAllSkillCategories(  ){
    return this.http.get<any>(`${this.baseUrl}api/skill/getAllCategories`)
  .pipe(
    map( res =>{ 
          console.log('from service getAllSkillCategories', res)
            return res} )
    );
  }

  suggestEmployeeBySkill( skills : any[] ){

    const body = { skills  }
    console.log(body);
    return this.http.post<any>(`${this.baseUrl}api/employee/suggestEmployeeBySkill`, body)
  .pipe(
    map( res =>{ 
          console.log('from service suggestEmployeeBySkill', res)
            return res} )
    );
  }

  createProject( body : Project ){

    return this.http.post<any>(`${this.baseUrl}api/project/createProject`, body)
  .pipe(
    map( res =>{ 
          console.log('from service createProject', res)
            return res} )
    );
  }






  

  
  }