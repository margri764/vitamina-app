import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/protected/services/project/project.service';

@Component({
  selector: 'app-generic-success',
  templateUrl: './generic-success.component.html',
  styleUrls: ['./generic-success.component.scss']
})
export class GenericSuccessComponent implements OnInit {

  msg : string = "Operación exitosa!!";
  confirm : boolean = false;
  
  constructor(
                @Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef : MatDialogRef<GenericSuccessComponent>,
                private projectService : ProjectService
  ) { }

  ngOnInit(): void {
    this.msg = this.data;
  }

  continue(){
    this.confirm = true;
    this.projectService.emitSuccessProject$.emit(true);
      setTimeout(()=>{
        this.dialogRef.close();
      }, 300)

  }

}
