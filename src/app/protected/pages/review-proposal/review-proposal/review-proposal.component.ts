import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReviewProposalMessagComponent } from 'src/app/protected/messages/review-proposal-message/review-proposal-messag/review-proposal-messag.component';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { ProjectService } from 'src/app/protected/services/project/project.service';

@Component({
  selector: 'app-review-proposal',
  templateUrl: './review-proposal.component.html',
  styleUrls: ['./review-proposal.component.scss']
})
export class ReviewProposalComponent implements OnInit {
  
  confirm: boolean = false;
  myForm! : FormGroup;


  constructor(
            private activatedRoute : ActivatedRoute,
            private authService : AuthService,
            private fb : FormBuilder,
            private projectService : ProjectService,
            private dialog : MatDialog
) { 

  this.activatedRoute.params.subscribe(
    ({code})=>{ this.getCodes(code) });

    this.myForm = this.fb.group({
      review:  [ '', [Validators.required]],
    });
}

ngOnInit(): void {
}

getCodes( codes:string){

  const clientId = codes.substring(0, 20);
  const projectId = codes.substring(20).trim();

  console.log(clientId, projectId);
  this.setProjectState(projectId, 'Reviewed');
}

setProjectState( projectId:string, state:string ){
    this.projectService.setProjectState(projectId, state).subscribe(
    ({success})=>{
    if(success){
    // this.openDialogReviewProposal();
    }
    })
}

onSave(){

  this.confirm = true;

}

openDialogReviewProposal( ){

    let width : string= "";
    let height: string ="";

    if(screen.width >= 800) {
    width = "400px";
    height ="330px";
    }

    this.dialog.open(ReviewProposalMessagComponent, {
    disableClose: true,
    width: `${width}`|| "",
    height:`${height}`|| "",
    panelClass:"custom-modalbox-acceptProposal", 
    });
}
}
