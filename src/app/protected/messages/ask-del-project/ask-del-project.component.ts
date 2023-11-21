import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project/project.service';

@Component({
  selector: 'app-ask-del-project',
  templateUrl: './ask-del-project.component.html',
  styleUrls: ['./ask-del-project.component.scss']
})
export class AskDelProjectComponent implements OnInit {

  confirm : boolean = false;
  name : string = ''

  constructor(
             private dialogRef : MatDialogRef<AskDelProjectComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private projectService : ProjectService
  ) { }

  ngOnInit(): void {
    this.name = this.data;
  }

  closeComponent(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    this.projectService.authDelProject$.emit(true);

    setTimeout( ()=>{
      this.dialogRef.close();
    },500)


  }
}