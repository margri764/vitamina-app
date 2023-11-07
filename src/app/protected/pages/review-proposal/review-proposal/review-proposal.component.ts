import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { GenericSuccessComponent } from 'src/app/protected/messages/generic-success/generic-success/generic-success.component';
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
  clientId: string = '';
  projectId: string = '';
  isLoading : boolean = false;


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
      clientFeedback:  [ '', [Validators.required]],
    });
}

ngOnInit(): void {

  this.projectService.closeClientFeedback$.subscribe( (emmited)=>{ if(emmited){ setTimeout(()=>{window.close()},400) }})
}

getCodes( codes:string){

  this.clientId = codes.substring(0, 20);
  this.projectId = codes.substring(20).trim();

  this.setProjectState(this.projectId, 'Reviewed');
}

setProjectState( projectId:string, state:string ){
    this.projectService.setProjectState(projectId, state).subscribe(
    ({success})=>{
    if(success){
    this.openDialogReviewProposal();
    }
    })
}  

onSave(){

  // sendAdminNotification( body:any, projectId:any, notification:string ){
  
  if ( this.myForm.invalid ) {
    this.myForm.markAllAsTouched();
    return;
  }
  this.confirm = true;
  console.log(this.myForm.value, this.projectId);

  this.projectService.clientReview(this.myForm.value, this.projectId, "review").subscribe( 
    ( {success, project} )=>{
      if(success){
        this.openDialogSuccesss( 'Thank you for your feedback, we will contact you soon.')
        this.projectService.sendAdminNotification(project._id, "Review")
      }
    })

}

validField( field: string ) {
  return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}


openDialogSuccesss( body:any ){

  let width = "";
  let height ="";

    if(screen.width >= 800) {
      width = "400px";
      height ="330px";
    }
  
    this.dialog.open(GenericSuccessComponent, {
      data: body,
      disableClose: true,
      width: `${width}`|| "",
      height:`${height}`|| "",
      panelClass:"custom-modalbox-NoMoreComponent", 
    });
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
