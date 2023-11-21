import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from 'src/app/protected/services/project/project.service';

@Component({
  selector: 'app-ask-send-proposal',
  templateUrl: './ask-send-proposal.component.html',
  styleUrls: ['./ask-send-proposal.component.scss']
})
export class AskSendProposalComponent implements OnInit {

  msg : string = '';
  confirm: boolean = false;
  
  constructor(
             private dialogRef : MatDialogRef<AskSendProposalComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private projectService : ProjectService
  ) { }

  ngOnInit(): void {
    this.msg = this.data;
  }

  closeComponent(){
    this.projectService.authSendProposal$.emit(false),
    this.dialogRef.close();
    
  }

  continue(){
    this.confirm = true;
    setTimeout( ()=>{
      this.dialogRef.close();
      this.projectService.authSendProposal$.emit(true)
    },500)


  }
}
