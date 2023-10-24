import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

    updateEditingEmployee$ : EventEmitter<boolean> = new EventEmitter<boolean>; 

  
    // token : string = '';
    employee! : any;
  
    private baseUrl = environment.baseUrl;
  
    constructor(  
                  private http : HttpClient,
                  // private store : Store <AppState>,
                  private router : Router
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
  
  // deleteEmployeeById( id:any){
  //                    id = "2737";                   
  //   return this.http.delete<any>(`${this.baseUrl}api/Employee(delete/${id}`)
  // .pipe(
  //   map( res =>{ 
  //         console.log('desde service deleteCulientById', res)
  //           return res} )
  //   );
  // }
  
  // addNewEmployee( body : User){
  
  
  // return this.http.post<any>(`${this.baseUrl}api/Employee`, body)
  // .pipe(
  //   map( res =>{ 
  //          console.log('desde service addNewEmployee', res)
  //   return res} )
  //   );
  // }
  
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
  

  
  }