import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-generic-message',
  templateUrl: './generic-message.component.html',
  styleUrls: ['./generic-message.component.scss']
})
export class GenericMessageComponent implements OnInit {

  msg :string = '';
  confirm : boolean = false; 
  constructor(
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef : MatDialogRef<GenericMessageComponent>,
              private errorService : ErrorService

  ) { }

  ngOnInit(): void {

    this.msg = this.data;
  }

  continue(){
    this.confirm = true;
    this.errorService.authContinueGenericSuccess$.emit(true);
    setTimeout(()=>{this.dialogRef.close()},200)
    
  }
}
