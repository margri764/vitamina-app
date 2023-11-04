import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericSuccessComponent } from 'src/app/protected/messages/generic-success/generic-success/generic-success.component';
import { ProjectService } from 'src/app/protected/services/project/project.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit, AfterViewInit  {

  @ViewChild ("top" , {static: true} ) top! : ElementRef;
  
  
  phone : boolean = false;
  id : string = '';
  project: any;
  duration: number = 0;
  total: number = 0;
  isLoading : boolean = false;
  confirm: boolean = false;
  element:any;
  submittedDate: string='';

  constructor(
               private activatedRoute : ActivatedRoute,
               private projectService : ProjectService,
               private dialog : MatDialog,
               private router : Router
             )
{ 

    (screen.width <=800) ? this.phone = true : this.phone = false;

    this.activatedRoute.params.subscribe(
    ( {id} ) =>{ this.getProyectById(id); this.id = id; });

}

  ngOnInit(): void {

  }

  ngAfterViewInit() {
      this.scrollToTop();
  }

  scrollToTop(){
    setTimeout( () => {
      this.element = this.top.nativeElement;
      this.element.scrollIntoView(
      { alignToTop: true,
        // behavior: "smooth",
        block: "start",
      });
      }, 0);
    
  }

  getProyectById( id:string ){
    this.isLoading = true;
      this.projectService.getProjectById(id).subscribe( 
        ( {project} )=>{
          this.isLoading = false;
          if(project){
            this.project = project;
            this.getDuration();
            this.submmitedProposalDate();
          }
        })
  }


  submmitedProposalDate(){

      if(this.project.proposal.length !== 0){
            this.project.proposal.forEach( (item:any)=>{  this.submittedDate = item.submittedDate });
      }else{
        return;
      }
  
    }

  // getTotal(){

  //   if(this.arrProjectTime.length === 0){
  //     return 0
  //   }
  //  this.total = this.arrProjectTime.reduce((total, employee) => total + (employee.hourly_rate * employee.time), 0);
  
  //   return this.total;
  // }

  getDuration(){
    this.duration = this.project.duration.reduce((total: any, employee: any ) => total + employee.assigned_hours, 0);
  
    this.total = this.project.duration.reduce((total: any, employee: any ) => total + (employee.assigned_hours * employee.hourly_rate), 0);
  }

  sendProject( action:string ){
    this.confirm = true;
    this.isLoading = true;
    this.projectService.sendProposal(this.id, action).subscribe( 
      ({success})=>{
        if(success){
          if(action === "create"){
            this.openDialogSuccesss('Proposal sent successfully');
          }else if(action === 'resend'){
            this.openDialogSuccesss('Proposal has been successfully re-sent');
          }
          this.getProyectById(this.id);

        }
      });
  }

  openDialogSuccesss( body:any ){

    let width = "";
    let height ="";

      if(screen.width >= 800) {
        width = "400px";
        height ="320px";
      }
    
      this.dialog.open(GenericSuccessComponent, {
        data: body,
        width: `${width}`|| "",
        height:`${height}`|| "",
        panelClass:"custom-modalbox-NoMoreComponent", 
      });
  }


}
