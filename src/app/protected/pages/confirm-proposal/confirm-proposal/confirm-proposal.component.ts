import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { AddSkillRateComponent } from '../../add-skill-rate/add-skill-rate/add-skill-rate.component';
import { AcceptMessageProposalComponent } from 'src/app/protected/messages/accept-proposal-message/accept-message-proposal/accept-message-proposal.component';
import { ProjectService } from 'src/app/protected/services/project/project.service';

@Component({
  selector: 'app-confirm-proposal',
  templateUrl: './confirm-proposal.component.html',
  styleUrls: ['./confirm-proposal.component.scss']
})
export class ConfirmProposalComponent implements OnInit {


  constructor(
              private activatedRoute : ActivatedRoute,
              private authService : AuthService,
              private projectService : ProjectService,
              private dialog : MatDialog
  ) { 
            this.activatedRoute.params.subscribe(
              ({code})=>{ this.getCodes(code) })
  }

  ngOnInit(): void {
  }

getCodes( codes:string){

  const clientId = codes.substring(0, 20);
  const projectId = codes.substring(20).trim();
  this.setProjectState(projectId, 'Accepted');
}

setProjectState( projectId:string, state:string ){
    this.projectService.setProjectState(projectId, state).subscribe(
      ({success})=>{
        if(success){
          this.openDialogAcceptProposal();
        }
      })

  }


  openDialogAcceptProposal( ){

    let width : string= "";
    let height: string ="";

      if(screen.width >= 800) {
        width = "400px";
        height ="330px";
      }
    
      this.dialog.open(AcceptMessageProposalComponent, {
        width: `${width}`|| "",
        height:`${height}`|| "",
        disableClose: true,
        panelClass:"custom-modalbox-acceptProposal", 
      });
  }
}
