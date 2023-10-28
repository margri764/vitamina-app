import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';
import * as authActions from 'src/app/auth.actions';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-assign-time',
  templateUrl: './assign-time.component.html',
  styleUrls: ['./assign-time.component.scss']
})
export class AssignTimeComponent implements OnInit, OnDestroy {

  myForm!: FormGroup;
  confirm: boolean = false;
  employee: any;
  authSubscription! : Subscription;


  constructor(
              private fb: FormBuilder,
              private dialogRef : MatDialogRef<AssignTimeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private validatorService : ValidatorService,
              private store : Store<AppState>
              // private employeeService : EmployeeService,
              // private errorService : ErrorService,

  ) 
  { 
    this.myForm = this.fb.group({
      time:  [ '', [this.validatorService.positiveNumberWithDecimals()] ]
    });

  }
  

  ngOnInit(): void {

    this.employee = this.data;

    this.authSubscription =this.store.select('auth')
    .pipe(
      filter( ({projectSkills})=>  projectSkills != null && projectSkills.length != 0),
    ).subscribe(
      ({projectTime})=>{
        this.searchEmployeeId(projectTime);

      })

      
 

  }

  searchEmployeeId(projectTime: any) {
    const idToSearch = this.employee._id;
  
    const foundEmployee = projectTime.find((item:any) => item.id === idToSearch);
  
    if (foundEmployee) {
      alert('Empleado encontrado');
    } else {
      alert('Empleado no encontrado');
    }
  }
  

  onSaveForm(){
    
    if ( this.myForm.invalid  ) {
      this.myForm.markAllAsTouched();
      return;
    }

    const time = this.myForm.get('time')?.value;
    const id = this.employee._id;
    const hourly_rate = this.employee.hourly_rate;
    const name = this.employee.name;
    const projectTime = { id, name, hourly_rate, time };

    this.store.dispatch(authActions.setEmployeeProjectTime({ projectTime: [projectTime] }));

    setTimeout(()=>{ this.close() },400)
  }

  get numberErrorMsg(): string {

    const errors = this.myForm.get('time')?.errors;
    if ( errors?.['required'] ) {
      return 'Required';
    } else if ( errors?.['positiveNumberWithDecimals'] ) {
      return 'No se permiten numeros negativos. Solo dos digitos despues de la coma. Si la acción es de DISMINUIR solo se aceptan 2 cifras';
    } 
    
    return '';
    }


  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

  close(){
    this.dialogRef.close();
  }


  
  ngOnDestroy(): void {
    if(this.authSubscription){
      this.authSubscription.unsubscribe();

    }
  }

}
