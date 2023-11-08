import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { ProjectService } from 'src/app/protected/services/project/project.service';

@Component({
  selector: 'app-ask-dont-show',
  templateUrl: './ask-dont-show.component.html',
  styleUrls: ['./ask-dont-show.component.scss']
})
export class AskDontShowComponent implements OnInit {

  confirm : boolean = false;
  name : string = 'sin nombre'
  constructor(
             private errorService: ErrorService,
             private dialogRef : MatDialogRef<AskDontShowComponent>,
             private projectService : ProjectService
            //  @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    // this.name = this.data;
  }

  closeComponent(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    this.projectService.authDontShowAgain$.emit(true),
    setTimeout( ()=>{
      this.dialogRef.close();
    },500)


  }
}
