import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-ask-del-skill',
  templateUrl: './ask-del-skill.component.html',
  styleUrls: ['./ask-del-skill.component.scss']
})
export class AskDelSkillComponent implements OnInit {

  confirm : boolean = false;
  name : string = 'sin nombre'
  constructor(
             private employeeService: EmployeeService,
             private dialogRef : MatDialogRef<AskDelSkillComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.name = this.data;
  }

  closeComponent(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    this.employeeService.authDelSkill$.emit(true),
    setTimeout( ()=>{
      this.dialogRef.close();
    },500)


  }
}
