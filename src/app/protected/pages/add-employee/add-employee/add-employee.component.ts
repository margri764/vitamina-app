import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { saveDataSS } from 'src/app/protected/Storage';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';
import { AddSkillRateComponent } from '../../add-skill-rate/add-skill-rate/add-skill-rate.component';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  myForm!: FormGroup;
  confirm : boolean = false;
  isLoading : boolean = false;

  constructor(
             private fb: FormBuilder,
              private dialogRef : MatDialogRef<AddEmployeeComponent>,
              private employeeService : EmployeeService,
              private errorService : ErrorService,
              private validatorService : ValidatorService,
              private dialog : MatDialog

  ) {
    this.myForm = this.fb.group({
      name: [ '', [Validators.required] ],
      headline:  [ '', [Validators.required]],
      email:  [ '', [ Validators.pattern(this.validatorService.emailPattern)]],
      phone:  [ ''],
      street_address:  [ ''],
      city:  [ ''],
      state:  [ ''],
      postal_code:  [ ''],
      country:  [ ''],
      hourly_rate: 0,
      skillList: [[]],
    });
  }

  ngOnInit(): void {

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

    const body = {
                  ...this.myForm.value,
                  contact_info : {
                    street_address: this.myForm.get('street_address')?.value,
                    city: this.myForm.get('city')?.value,
                    state: this.myForm.get('state')?.value,
                    postal_code: this.myForm.get('postal_code')?.value,
                    country: this.myForm.get('country')?.value,
                    email: this.myForm.get('email')?.value,
                    phone: this.myForm.get('phone')?.value,
                    headline: this.myForm.get('headline')?.value,
                  }
              }
    
    saveDataSS('tempEmployee', body);

    setTimeout(()=>{ this.close() },300)
    
    setTimeout(()=>{ this.opendialogSkillRate(body) },900)
    

    // this.employeeService.addNewEmployee(body).subscribe( 
    //   ({success})=>{
    //     this.isLoading = false;
    //     if(success){
    //       this.close();
    //       this.employeeService.updateEditingEmployee$.emit(true);
    //     }
    //   });
  }

  opendialogSkillRate( body:any ){

    let width = "";
    let height ="";

      if(screen.width >= 800) {
        width = "600px";
        height ="700px";
      }
    
      this.dialog.open(AddSkillRateComponent, {
        data: body,
        width: `${width}`|| "",
        height:`${height}`|| "",
        panelClass:"custom-modalbox-NoMoreComponent", 
      });
  }

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}
