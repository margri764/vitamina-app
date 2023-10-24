import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';

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
             private validatorService : ValidatorService,
  ) { 
    
    this.myForm = this.fb.group({
      street: [ '', [Validators.required] ],
      state:  [ '', [Validators.required]],
      email:  [ '', [Validators.required]],
      phone:  [ '', [Validators.required]],
      city:  [ '', [Validators.required]],
      postal_code:  [ '', [Validators.required]],
      country:  [ '', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.employee = this.data;

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited)this.isLoading = false; this.close()})

    this.myForm = this.fb.group({

      street: [ this.employee.contact_info.street_address, [Validators.required] ],
      state:  [ this.employee.contact_info.state, [Validators.required]],
      email:  [ this.employee.contact_info.email, [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
      phone:  [ this.employee.contact_info.phone, [Validators.required]],
      city:  [ this.employee.contact_info.city, [Validators.required]],
      country:  [ this.employee.contact_info.country, [Validators.required]],
      postal_code:  [ this.employee.contact_info.postal_code, [Validators.required]],
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

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const street = this.myForm.get('street')?.value;
    const city = this.myForm.get('city')?.value;
    const state = this.myForm.get('state')?.value;
    const email = this.myForm.get('email')?.value;
    const phone = this.myForm.get('phone')?.value;
    const country = this.myForm.get('country')?.value;
    const postal_code = this.myForm.get('postal_code')?.value;

    const updatedEmployee = { ...this.employee };
    updatedEmployee.contact_info.street_address = street;
    updatedEmployee.contact_info.state = state;
    updatedEmployee.contact_info.email = email;
    updatedEmployee.contact_info.phone = phone;
    updatedEmployee.contact_info.city = city;
    updatedEmployee.contact_info.country = country;
    updatedEmployee.contact_info.postal_code = postal_code;

    this.employeeService.updateEmployeeById(updatedEmployee, this.employee._id).subscribe( 
      ({success})=>{
        this.isLoading = false;
        if(success){
          this.close();
          this.employeeService.updateEditingEmployee$.emit(true);
        }
      });
  }

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}
