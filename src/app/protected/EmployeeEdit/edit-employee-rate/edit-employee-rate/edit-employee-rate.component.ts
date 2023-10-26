import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-edit-employee-rate',
  templateUrl: './edit-employee-rate.component.html',
  styleUrls: ['./edit-employee-rate.component.scss']
})
export class EditEmployeeRateComponent implements OnInit {
  
  employee: any; 
  confirm : boolean = false;
  isLoading : boolean = false;
  myForm! : FormGroup;

  constructor(
              private fb : FormBuilder,
              private dialogRef : MatDialogRef<EditEmployeeRateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private errorService : ErrorService,
              private employeeService : EmployeeService
  ) { 

    this.myForm = this.fb.group({
      hourly_rate:  [ '', [Validators.required]],
    });
  }

  ngOnInit(): void {

    this.employee = this.data;
    console.log(this.employee);
    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited)this.isLoading = false; this.close()});

    this.myForm = this.fb.group({
      hourly_rate:  [ this.employee.hourly_rate, [Validators.required]],
    });

  }

  onSave() {

    const hourly_rate = this.myForm.get('hourly_rate')?.value;

    if ( this.myForm.invalid || hourly_rate === '') {
      this.myForm.markAllAsTouched();
      return;
    }

    const updatedEmployee = { ...this.employee };
    updatedEmployee.hourly_rate = hourly_rate;

    this.employeeService.updateEmployeeById(updatedEmployee, this.employee._id).subscribe( 
      ({success})=>{
        this.isLoading = false;
        if(success){
          this.close();
          this.employeeService.updateEditingEmployee$.emit(true);
        }
      });

  
  }

  close(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    setTimeout( ()=>{
      this.dialogRef.close();
    },500)
  }


}
