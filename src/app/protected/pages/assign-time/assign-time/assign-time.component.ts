import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';
import * as authActions from 'src/app/auth.actions';
import { Subscription, filter, take } from 'rxjs';
import { WrongActionMessageComponent } from 'src/app/protected/messages/wrong-action-message/wrong-action-message/wrong-action-message.component';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


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
  foundEmployee: any;
  editing: boolean = false;
  projectTime: any;
  duration:any;

  durationInSeconds = 30;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom'


  constructor(
              private fb: FormBuilder,
              private dialogRef : MatDialogRef<AssignTimeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private validatorService : ValidatorService,
              private store : Store<AppState>,
              private dialog : MatDialog,
              private employeeService : EmployeeService,
              private _snackBar: MatSnackBar
              // private errorService : ErrorService,
  ) 
  { 
    this.myForm = this.fb.group({
      time:  [ '', [this.validatorService.positiveNumberWithDecimals()] ]
    });

  }
  

  ngOnInit(): void {

    this.employee = this.data.employee;
    this.duration = this.data.duration;



    this.authSubscription =this.store.select('auth')
    .pipe(
      filter( ({projectSkills})=>  projectSkills != null && projectSkills.length != 0),
    ).subscribe(
      ({projectTime})=>{
        this.projectTime = projectTime;
        // this.searchEmployeeId(projectTime);

      })

      this.searchEmployeeId();

  }


  // with this I manage the employee´s time editing 
  searchEmployeeId() {

    if(!this.employee.availability){

        this.openGenericMsgAlert('This employee is not available, do you want continue anyway?');

        this.employeeService.askNoAvailableEmployee$.pipe(
          take(1)
        ).subscribe ( (auth)=>{
          if(!auth){
            this.close();
          }else{
            const idToSearch = this.employee._id;
            this.foundEmployee = this.projectTime.find((item:any) => item._id === idToSearch);
            if (this.foundEmployee !== undefined) {
              this.myForm.get('time')?.setValue(this.foundEmployee.time);
              this.editing = true;
            } else{
              return
            }
          }
        })
    }else{

    const idToSearch = this.employee._id;
    this.foundEmployee = this.projectTime.find((item:any) => item._id === idToSearch);
    if (this.foundEmployee !== undefined) {
      this.myForm.get('time')?.setValue(this.foundEmployee.time);
      this.editing = true;
    } else{
      return
    }
   }
}

openSnackBar( remainingHoursToAssign:number) {
  let msg : any;
    msg = `You have just ${remainingHoursToAssign} hours to assign.` 
    this._snackBar.open( msg, 'close', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    })
  }
  

  onSaveForm(){

    const numeroDecimal = this.myForm.get('time')?.value;
    
    if ( this.myForm.invalid || numeroDecimal == '') {
      this.myForm.markAllAsTouched();
      return;
    }
    this.confirm = true;

    const time = parseFloat(numeroDecimal);
    const _id = this.employee._id;
    const hourly_rate = this.employee.hourly_rate;
    const name = this.employee.name;
    const availability = this.employee.availability
    const projectTime = { _id, name, hourly_rate, time, availability };

    
    const hoursToAssing =  this.projectTime.reduce((total: any, employee: any ) => total + employee.time, 0);

    if(!this.editing){
      
      this.store.dispatch(authActions.setEmployeeProjectTime({ projectTime: [projectTime] }));

      let tempRemainingHours = this.projectTime.reduce((total: any, employee: any ) => total + employee.time, 0);

      if(this.duration < tempRemainingHours){
        const remainingHoursToAssign = this.duration - hoursToAssing ;

        this.openSnackBar(remainingHoursToAssign);

        this.store.dispatch(authActions.deleteEmployeeProjectTime( {id:_id} ));


         return;
       }
      setTimeout(()=>{ this.close() },300);

    }else{
      // editing
      const updatedProjectTime = { _id, name, hourly_rate, time, availability };
      this.store.dispatch( authActions.editEmployeeProjectTime({ updatedProjectTime }) );
      let tempRemainingHours = this.projectTime.reduce((total: any, employee: any ) => total + employee.time, 0);

      if(this.duration < tempRemainingHours){
        const remainingHoursToAssign = this.duration - hoursToAssing ;
        this.openSnackBar(remainingHoursToAssign);
        this.store.dispatch(authActions.deleteEmployeeProjectTime( {id:_id} ));

      return;
      }


          
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
        width = "600px"
        height ="310px";
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
