import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';
import * as authActions from 'src/app/auth.actions';
import { Subscription, filter } from 'rxjs';
import { WrongActionMessageComponent } from 'src/app/protected/messages/wrong-action-message/wrong-action-message/wrong-action-message.component';

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
              private store : Store<AppState>,
              private dialog : MatDialog
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
    console.log(this.employee);

    this.authSubscription =this.store.select('auth')
    .pipe(
      filter( ({projectSkills})=>  projectSkills != null && projectSkills.length != 0),
    ).subscribe(
      ({projectTime})=>{
        this.searchEmployeeId(projectTime);

      })

      
 

  }

  foundEmployee: any;
  editing: boolean = false;

  // with this I manage the employee´s time editing 
  searchEmployeeId(projectTime: any) {

    if(!this.employee.availability){

        this.openGenericMsgAlert('This employee in not available. ')
        this.close();
      return
    }

    const idToSearch = this.employee._id;
    this.foundEmployee = projectTime.find((item:any) => item.id === idToSearch);
    if (this.foundEmployee !== undefined) {
      this.myForm.get('time')?.setValue(this.foundEmployee.time);
      this.editing = true;
    } else{
      return
    }
  }
  

  onSaveForm(){

    const numeroDecimal = this.myForm.get('time')?.value;
    
    if ( this.myForm.invalid ||numeroDecimal == '') {
      this.myForm.markAllAsTouched();
      return;
    }
    this.confirm = true;

    const time = parseFloat(numeroDecimal);
    const id = this.employee._id;
    const hourly_rate = this.employee.hourly_rate;
    const name = this.employee.name;
    const projectTime = { id, name, hourly_rate, time };

    if(!this.editing){
      
      this.store.dispatch(authActions.setEmployeeProjectTime({ projectTime: [projectTime] }));
      setTimeout(()=>{ this.close() },300)

    }else{
      // editing
      const updatedProjectTime = { id, name, hourly_rate,time };

      this.store.dispatch(
        authActions.editEmployeeProjectTime({ updatedProjectTime }) );
          
          setTimeout(() => {
            this.close();
          }, 300);

        }
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

    openGenericMsgAlert(msg : string){

      let width : string = '';
      let height : string = '';
  
      if(screen.width >= 800) {
        width = "350px"
        height ="280px";
      }
  
      this.dialog.open(WrongActionMessageComponent, {
        data: msg,
        width: `${width}`|| "",
        height:`${height}`|| "",
        // disableClose: true,
        panelClass:"custom-modalbox-NoMoreComponent", 
      });
    
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
