import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-wrong-action-message',
  templateUrl: './wrong-action-message.component.html',
  styleUrls: ['./wrong-action-message.component.scss']
})
export class WrongActionMessageComponent implements OnInit {

  confirm : boolean = false;
  msg : string = 'Error en la acción'

  constructor( 
              private dialogRef : MatDialogRef<WrongActionMessageComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private router : Router,
              private employeeService : EmployeeService,
              private errorService : ErrorService
              )
   { }

  ngOnInit(): void {
    this.msg = this.data;
    
  }

  continue(){
    this.confirm = true;
    this.employeeService.askNoAvailableEmployee$.emit(true);
    this.errorService.closeIsLoading$.emit(true);

    setTimeout(()=>{ this.dialogRef.close() },300);

    if(this.msg === "Internal Server Error. Sorry, something went wrong on our server. Please try again later"){
      this.router.navigateByUrl('/login');
      return
    }
    
  }

  close(){
    this.dialogRef.close();
    this.employeeService.askNoAvailableEmployee$.emit(false);
    this.errorService.closeIsLoading$.emit(true);

  }

}
