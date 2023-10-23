import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-edit-employee-name',
  templateUrl: './edit-employee-name.component.html',
  styleUrls: ['./edit-employee-name.component.scss']
})
export class EditEmployeeNameComponent implements OnInit {

  employee : any;
  confirm : boolean = false;
  myForm!: FormGroup;
  isLoading : boolean = false;

  constructor(
             private dialogRef : MatDialogRef<EditEmployeeNameComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private fb: FormBuilder,
             private employeeService : EmployeeService,
             private errorService : ErrorService,
  ) { 
    
    this.myForm = this.fb.group({
      name: [ '', [Validators.required] ],
      headline:  [ '', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.employee = this.data;

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited)this.isLoading = false; this.close()})

    this.myForm = this.fb.group({

      name: [ this.employee.name, [Validators.required] ],
      headline:  [ this.employee.contact_info.headline, [Validators.required]],
    });
  }

  close(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    // this.errorService.authDelClient$.emit(true),
    setTimeout( ()=>{
      this.dialogRef.close();
    },500)


  }

  onSaveForm(){

    this.isLoading = true;
    const name = this.myForm.get('name')?.value;
    const headline = this.myForm.get('headline')?.value;
    const updatedEmployee = { ...this.employee };
    updatedEmployee.contact_info.headline = headline;
    updatedEmployee.name = name;

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
