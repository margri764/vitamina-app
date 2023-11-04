import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-proposal-messag',
  templateUrl: './review-proposal-messag.component.html',
  styleUrls: ['./review-proposal-messag.component.scss']
})
export class ReviewProposalMessagComponent implements OnInit {

  isLoading: boolean = false;
  confirm : boolean = false;

  constructor(
             private dialogRef : MatDialogRef<ReviewProposalMessagComponent>,
  ) { }

  ngOnInit(): void {
  }

  closeComponent(){
    this.dialogRef.close();
    window.close();
  }

  continue(){
    this.confirm = true;
    this.dialogRef.close();

    
  }
}