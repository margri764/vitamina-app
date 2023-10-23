import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-edit-employee-info',
  templateUrl: './edit-employee-info.component.html',
  styleUrls: ['./edit-employee-info.component.scss']
})
export class EditEmployeeInfoComponent implements OnInit {

  employee : any;
  confirm : boolean = false;
  myForm!: FormGroup;
  isLoading : boolean = false;

  constructor(
             private dialogRef : MatDialogRef<EditEmployeeInfoComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private fb: FormBuilder,
             private employeeService : EmployeeService,
             private errorService : ErrorService,
  ) { 
    
    this.myForm = this.fb.group({
      street: [ '', [Validators.required] ],
      state:  [ '', [Validators.required]],
      email:  [ '', [Validators.required]],
      phone:  [ '', [Validators.required]],
      city:  [ '', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.employee = this.data;

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited)this.isLoading = false; this.close()})

    this.myForm = this.fb.group({

      street: [ this.employee.contact_info.street_address, [Validators.required] ],
      state:  [ this.employee.contact_info.state, [Validators.required]],
      email:  [ this.employee.contact_info.email, [Validators.required]],
      phone:  [ this.employee.contact_info.phone, [Validators.required]],
      city:  [ this.employee.contact_info.phone, [Validators.required]],
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

  onSaveForm(){

    // this.isLoading = true;
    // const name = this.myForm.get('name')?.value;
    // const headline = this.myForm.get('headline')?.value;
    // const updatedEmployee = { ...this.employee };
    // updatedEmployee.contact_info.headline = headline;
    // updatedEmployee.name = name;

    // this.employeeService.updateEmployeeById(updatedEmployee, this.employee._id).subscribe( 
    //   ({success})=>{
    //     this.isLoading = false;
    //     if(success){
    //       this.close();
    //       this.employeeService.updateEditingEmployee$.emit(true);
    //     }
    //   });
  }

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}
