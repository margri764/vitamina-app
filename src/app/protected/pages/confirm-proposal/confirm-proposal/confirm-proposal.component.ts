import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/protected/services/auth/auth.service';

@Component({
  selector: 'app-confirm-proposal',
  templateUrl: './confirm-proposal.component.html',
  styleUrls: ['./confirm-proposal.component.scss']
})
export class ConfirmProposalComponent implements OnInit {

  client:any;

  constructor(
              private activatedRoute : ActivatedRoute,
              private authService : AuthService
  ) { 
            this.activatedRoute.params.subscribe(
              ({code})=>{ this.getClientBycode(code) })
  }

  ngOnInit(): void {
  }

  getClientBycode( code:string ){
    this.authService.getClientByCode(code).subscribe(
      ({success, client})=>{
        if(success){
          this.client = client;
        }
      })

  }
}
