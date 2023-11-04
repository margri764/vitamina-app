import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-accept-message-proposal',
  templateUrl: './accept-message-proposal.component.html',
  styleUrls: ['./accept-message-proposal.component.scss']
})
export class AcceptMessageProposalComponent implements OnInit {

  isLoading: boolean = false;
  confirm : boolean = false;

  constructor(
             private dialogRef : MatDialogRef<AcceptMessageProposalComponent>,
  ) { }

  ngOnInit(): void {
  }

  closeComponent(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    window.close();
  }
}