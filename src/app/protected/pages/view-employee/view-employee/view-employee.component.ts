import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { EditEmployeeNameComponent } from '../../EmployeeEdit/edit-employee-name/edit-employee-name/edit-employee-name.component';
import { EditEmployeeInfoComponent } from '../../EmployeeEdit/edit-employee-info/edit-employee-info/edit-employee-info.component';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { EditEmployeeSkillsComponent } from '../../EmployeeEdit/edit-employee-skills/edit-employee-skills/edit-employee-skills.component';
import { take } from 'rxjs';
import { AskDelSkillComponent } from 'src/app/protected/messages/ask-del-skill/ask-del-skill/ask-del-skill.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditEmployeeRateComponent } from 'src/app/protected/EmployeeEdit/edit-employee-rate/edit-employee-rate/edit-employee-rate.component';
import { ViewProjectComponent } from '../../view-project/view-project/view-project.component';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {


  isLoading : boolean = false;
  height : string = '';
  width : string = '';
  id : string = '';
  phone : boolean = false;
  delSkill : boolean = false;
  myForm!: FormGroup;
  projects : any [] = [];


  employee: any = {
                  name: '',
                  contact_info: {
                    city: '',
                    country: ''
                  },
                  skillList: ['', ''],
                  hourly_rate: 0
  };


  constructor(
                  private activatedRoute : ActivatedRoute,
                  private employeeService : EmployeeService,
                  private errorService : ErrorService,
                  private dialog : MatDialog,
                  private fb : FormBuilder
                  // private store : Store<AppState>
 )
{ 
  (screen.width <=800) ? this.phone = true : this.phone = false;

  this.activatedRoute.params.subscribe(
   ( {id} ) =>{ this.getEmployeeById(id); this.id = id; });

   this.myForm = this.fb.group({
    hourly_rate:  [ '', [Validators.required]],
  });

}

  ngOnInit(): void {

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
    this.employeeService.updateEditingEmployee$.subscribe( (emmited)=>{ if(emmited){this.getEmployeeById(this.id)}});
    this.getEmployeeProjects(this.id)

    this.myForm = this.fb.group({
      hourly_rate:  [ this.employee.hourly_rate, [Validators.required]],
    });
  

  }

  getEmployeeById(id:string){
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe( 
      ( {employee} )=>{
        this.employee = employee;
        this.isLoading = false;
      });

  }


  getEmployeeProjects(id:string){
    this.isLoading = true;
    this.employeeService.getEmployeeProjects(id).subscribe( 
      ( {projects} )=>{
        this.projects = projects;
        this.isLoading = false;
      });

  }


  edit( value : string, employee:any){

    switch (value) {
      case 'name':
                  this.openDialogName(employee)
        break;

      case 'info':
                  this.openDialogInfo(employee)
        break;
    
      case 'add':
                 this.openDialogAddSkill(employee)
        break;

      case 'del':
                 this.delSkill = !this.delSkill;
        break;

      case 'hourly':
                 this.openDialogEditHourly(employee)
        break;
      
      default:
        break;
    }

  }


  deleteSkill( skill : any){   

    let { skillList } = this.employee;
    
    skillList = skillList.filter( (item:any)=> item !== skill);
    const updatedEmployee = {...this.employee};

    updatedEmployee.skillList = skillList;

    if(screen.width >= 800) {
      this.width = "400px";
      this.height = "280px";
    }
  
      this.dialog.open(AskDelSkillComponent, {
        width: `${this.width}`|| "",
        height:`${this.height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
    
    this.employeeService.authDelSkill$.pipe(
      take(1)
    ).subscribe((auth)=>{
      if(auth){
        this.employeeService.updateEmployeeSkill(updatedEmployee, this.employee._id).subscribe( ({success})=>{
          if(success){
            this.getEmployeeById(this.employee._id)
          }
      });
      }

    })
    
 
  }

  viewProject( project:any){
    // console.log(project);
    // if(screen.width >= 800) {
    //   this.width = "600px";
    //   this.height = "650px";
    // }
  
    //   this.dialog.open(ViewProjectComponent, {
    //     data:  project,
    //     width: `${this.width}`|| "",
    //     height:`${this.height}`|| "",
    //     panelClass:"custom-modalbox-edit",
    //   });
  }

  openDialogName( employee:any){

    if(screen.width >= 800) {
      this.width = "600px";
      this.height = "480px";
    }
  
      this.dialog.open(EditEmployeeNameComponent, {
        data:  employee,
        width: `${this.width}`|| "",
        height:`${this.height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  }
  
  openDialogInfo( employee:any){

    if(screen.width >= 800) {
      this.width = "600px";
      this.height = "540px";
    }
  
      this.dialog.open(EditEmployeeInfoComponent, {
        data:  employee,
        width: `${this.width}`|| "",
        height:`${this.height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  }

  openDialogEditHourly( employee:any){

    if(screen.width >= 800) {
      this.width = "600px";
      this.height = "270px";
    }
  
      this.dialog.open(EditEmployeeRateComponent, {
        data:  employee,
        width: `${this.width}`|| "",
        height:`${this.height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  }
    
  openDialogAddSkill( employee:any){

    this.delSkill = false;
    if(screen.width >= 800) {
      this.width = "600px";
      this.height = "260px";
    }
      this.dialog.open(EditEmployeeSkillsComponent, {
        data:  employee,
        width: `${this.width}`|| "",
        height:`${this.height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  }

}
