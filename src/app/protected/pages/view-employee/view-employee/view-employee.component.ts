import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {


  isLoading : boolean = false;

  employee: any = {
                  name: '',
                  contact_info: {
                    city: '',
                    country: ''
                  },
                  skillList: ['', ''],
                  hourly_rate: 0
  };


  constructor(
                  private activatedRoute : ActivatedRoute,
                  private employeeService : EmployeeService,
                  private errorService : ErrorService
                  // private store : Store<AppState>
 )
{ 
this.activatedRoute.params.subscribe(
( {id} ) =>{ this.getEmployeeById(id) })

}

  ngOnInit(): void {

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});

  }

  getEmployeeById(id:string){
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe( 
      ( {employee} )=>{
        this.employee = employee;
        this.isLoading = false;
      });

  }

}
