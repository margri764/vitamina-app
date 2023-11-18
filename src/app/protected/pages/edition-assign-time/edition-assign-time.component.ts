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
import { getDataSS, saveDataSS } from '../../Storage';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-edition-assign-time',
  templateUrl: './edition-assign-time.component.html',
  styleUrls: ['./edition-assign-time.component.scss']
})
export class EditionAssignTimeComponent implements OnInit {
  myForm!: FormGroup;
  confirm: boolean = false;
  employee: any;
  authSubscription! : Subscription;
  foundEmployee: any;
  editing: boolean = false;
  projectTime: any []=[];

  constructor(
              private fb: FormBuilder,
              private dialogRef : MatDialogRef<EditionAssignTimeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private validatorService : ValidatorService,
              private store : Store<AppState>,
              private dialog : MatDialog,
              private employeeService : EmployeeService,
              private projectService :ProjectService
              // private errorService : ErrorService,
  ) 
  { 
    this.myForm = this.fb.group({
      time:  [ '', [this.validatorService.positiveNumberWithDecimals()] ]
    });

  }
  
  // en el SS deberia guardar el tiempo del proyecto

  ngOnInit(): void {

    this.employee = this.data;

    let isProjectTime = getDataSS('projectTime')

    if(isProjectTime !== undefined){
      this.projectTime = isProjectTime;
    }



    // this.authSubscription =this.store.select('auth')
    // .pipe(
    //   filter( ({projectSkills})=>  projectSkills != null && projectSkills.length != 0),
    // ).subscribe(
    //   ({projectTime})=>{
    //     this.projectTime = projectTime;
    //   })

      this.searchEmployeeId();

  }


  // with this I manage the employee´s time editing 
  searchEmployeeId() {

    // el primer if es solo para saber si esta disponible el empleado
    if(!this.employee.availability){

        this.openGenericMsgAlert('This employee is not available, do you want continue anyway?');

        this.employeeService.askNoAvailableEmployee$.pipe(
          take(1)
        ).subscribe ( (auth)=>{
          // si quiere continuar aunque no este disponible, busca en redux, si el empleado esta quiere decir que ya se le asigno tiempo entonces se trata de una edicion de esas hs 
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
    } else {

      // si el empleado esta disponible se repite el codigo pero hace lo mismo que arriba

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

    this.projectTime.push(projectTime);

    if(!this.editing){

      saveDataSS("projectTime", projectTime);
      
      // this.store.dispatch(authActions.setEmployeeProjectTime({ projectTime: [projectTime] }));
      this.projectService.projectTimeRevProj$.emit(this.projectTime);
      setTimeout(()=>{ this.close() },300)

    }else{
      // editing

      const updatedProjectTime = { _id, name, hourly_rate, time, availability };
      this.projectTime.push(updatedProjectTime);
      
      saveDataSS("projectTime", updatedProjectTime);
      this.projectService.projectTimeRevProj$.emit(this.projectTime);

      // this.store.dispatch( authActions.editEmployeeProjectTime({ updatedProjectTime }) );
          
          setTimeout(() =>{ this.close() }, 300);

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
