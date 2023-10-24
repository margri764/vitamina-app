import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-add-skill-rate',
  templateUrl: './add-skill-rate.component.html',
  styleUrls: ['./add-skill-rate.component.scss']
})
export class AddSkillRateComponent implements OnInit {

  myForm!: FormGroup;
  confirm : boolean = false;
  isLoading : boolean = false;
  private body : any;

  constructor(
             private fb: FormBuilder,
              private dialogRef : MatDialogRef<AddSkillRateComponent>,
              private employeeService : EmployeeService,
              private errorService : ErrorService,
              private dialog : MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.myForm = this.fb.group({
      hourly_rate: [ '', [Validators.required] ],
      skillList:  [ '', [Validators.required]],
 
    });
  }

  ngOnInit(): void {
    
    this.body = this.data;
    console.log(this.body);
    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
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

    // this.employeeService.addNewEmployee(body).subscribe( 
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
