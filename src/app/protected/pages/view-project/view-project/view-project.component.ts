import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/protected/services/project/project.service';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit {

phone : boolean = false;
id : string = '';
project: any;
duration: number = 0;
total: number = 0;
isLoading : boolean = false;


  constructor(
               private activatedRoute : ActivatedRoute,
               private projectService : ProjectService
             )
{ 

    (screen.width <=800) ? this.phone = true : this.phone = false;

    this.activatedRoute.params.subscribe(
    ( {id} ) =>{ this.getProyectById(id); this.id = id; });



}

  ngOnInit(): void {
  }

  getProyectById( id:string ){
    this.isLoading = true;
      this.projectService.getProjectById(id).subscribe( 
        ( {project} )=>{
          this.isLoading = false;
          if(project){
           this.project = project;
           this.getDuration();
          }
        })
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

}
