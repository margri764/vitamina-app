import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { EditEmployeeNameComponent } from '../../EmployeeEdit/edit-employee-name/edit-employee-name/edit-employee-name.component';
import { EditEmployeeInfoComponent } from '../../EmployeeEdit/edit-employee-info/edit-employee-info/edit-employee-info.component';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {


  isLoading : boolean = false;
  height : string = '';
  width : string = '';
  id : string = '';

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
                  private errorService : ErrorService,
                  private dialog : MatDialog
                  // private store : Store<AppState>
 )
{ 
this.activatedRoute.params.subscribe(
( {id} ) =>{ this.getEmployeeById(id); this.id = id; })

}

  ngOnInit(): void {

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
    this.employeeService.updateEditingEmployee$.subscribe( (emmited)=>{ if(emmited){this.getEmployeeById(this.id)}});

  }

  getEmployeeById(id:string){
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe( 
      ( {employee} )=>{
        this.employee = employee;
        this.isLoading = false;
      });

  }

  edit( value : string, employee:any){

    switch (value) {
      case 'name':
                  this.openDialogName(employee)
        break;

      case 'info':
                  this.openDialogInfo(employee)
      break;
    
      default:
        break;
    }

  }


  openDialogName( employee:any){

    if(screen.width >= 800) {
      this.width = "600px";
      this.height = "480px";
    }
  
      this.dialog.open(EditEmployeeNameComponent, {
        data:  employee,
        width: `${this.width}`|| "",
        height:`${this.height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  }

  
  openDialogInfo( employee:any){

    if(screen.width >= 800) {
      this.width = "600px";
      this.height = "740px";
    }
  
      this.dialog.open(EditEmployeeInfoComponent, {
        data:  employee,
        width: `${this.width}`|| "",
        height:`${this.height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  }

}
