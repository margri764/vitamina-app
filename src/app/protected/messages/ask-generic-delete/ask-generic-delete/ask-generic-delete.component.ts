import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';

@Component({
  selector: 'app-ask-generic-delete',
  templateUrl: './ask-generic-delete.component.html',
  styleUrls: ['./ask-generic-delete.component.scss']
})
export class AskGenericDeleteComponent implements OnInit {

  confirm : boolean = false;
  name : string = ''
  constructor(
             private employeeService: EmployeeService,
             private dialogRef : MatDialogRef<AskGenericDeleteComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private authService : AuthService
  ) { }

  ngOnInit(): void {
    this.name = this.data;
  }

  closeComponent(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    this.employeeService.authDelEmployee$.emit(true),
    this.authService.authDelClient$.emit(true),
    setTimeout( ()=>{
      this.dialogRef.close();
    },500)


  }
}