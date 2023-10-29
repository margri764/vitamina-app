import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, filter, take } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ProjectSkillsComponent } from 'src/app/protected/messages/project-skills/project-skills/project-skills.component';
import { AskGenericDeleteComponent } from 'src/app/protected/messages/ask-generic-delete/ask-generic-delete/ask-generic-delete.component';
import { saveDataSS } from 'src/app/protected/Storage';
import { AssignTimeComponent } from '../../assign-time/assign-time/assign-time.component';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  displayedColumns: string[] = ['name', 'state','rate','action'];
  dataTableActive : any ;

  isLinear = false;
   myForm!: FormGroup;
   firstFormGroup!: FormGroup;
   secondFormGroup!: FormGroup;
   
  isLoading: boolean = false;
  confirm: boolean = false;
  selection: boolean = false;
  projectSkills: any []=[];
  arrFeatures : any [] = [];
  showDeleteIcon: boolean[] = new Array(this.projectSkills.length).fill(false);
  showDeleteIconFeature: boolean[] = new Array(this.arrFeatures.length).fill(false);
  employees : any [] = [];
  arrProjectTime : any [] =[];



  
  constructor(
              private fb : FormBuilder,
              private employeeService : EmployeeService,
              private dialog : MatDialog,
              private store : Store <AppState>,
              private validatorService : ValidatorService
              // private authService : AuthService,
              // private errorService : ErrorService,
  ) {



   
   }

  ngOnInit(): void {


    this.store.select('auth')
    .pipe(
      filter( ({projectSkills})=>  projectSkills != null && projectSkills.length != 0),
    ).subscribe(
      ({projectSkills, projectTime})=>{
        this.projectSkills = projectSkills;
        saveDataSS('projectSkills', projectSkills);
        this.suggestEmployeeBySkill();
        this.getProjectTime(projectTime);

      })

      this.myForm = this.fb.group({
        // firstCtrl: ['', Validators.required],
      });

      this.firstFormGroup = this.fb.group({
        // firstCtrl: ['', Validators.required],
      });

      this.secondFormGroup = this.fb.group({
        name: ['', ],
        features: [''],
        duration:  [ '', [this.validatorService.positiveNumberWithDecimals()] ]
      });

  }

  deleteEmployee(employee : any){

    let width : string = '';
    let height : string = '';

    if(screen.width >= 800) {
      width = "400px";
      height = "250px";
  
    }
      this.dialog.open(AskGenericDeleteComponent, {
        data: employee.name,
        width: `${width}`|| "",
        height:`${height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  
      this.employeeService.authDelEmployee$.pipe(
        take(1)
      ).subscribe( (auth: any)=> { // el ask-edit dispara ui boolean si se elige CONTINUAR con la acción
        this.isLoading = true;
        if(auth){
          this.employeeService.deleteEmployeeById(employee._id, employee).subscribe( 
            ({success})=>{
              if(success){
              // this.getInitialEmployees();
              this.isLoading = false;
              }
            })
        }
      })
    
  }
  

  onSaveForm(){

  }

  deleteSkill( skill:any){
    this.projectSkills= this.projectSkills.filter( (item:any)=> item !== skill);
  }


  onEnterKey(event: Event) {
    event.stopPropagation();

    const newFeature = this.secondFormGroup.get('features')?.value;
    
    if (event instanceof KeyboardEvent && event.key === 'Enter') {
      
      this.arrFeatures.push(newFeature);
      this.secondFormGroup.controls['features'].setValue('');
    }
  }

  delFeature( feature:any ){
    this.arrFeatures= this.arrFeatures.filter( (item:any)=> item !== feature);
  }
  
  suggestEmployeeBySkill(){

      this.isLoading = true;

      this.employeeService.suggestEmployeeBySkill(this.projectSkills).subscribe( 
        ( {success, employees})=>{
          if(success){
            this.employees = employees;
            this.dataTableActive = employees;
            this.isLoading = false
          }
        });
  }

  validField( field: string ) {
    return this.secondFormGroup.controls[field].errors && this.secondFormGroup.controls[field].touched;
}


  getProjectTime( projectTime:any){
    if(!projectTime) return;

    this.arrProjectTime = projectTime;

  }

  openDialogSkills(){

      this.selection = true;

      this.dialog.open(ProjectSkillsComponent, {
 
        panelClass:"custom-modalbox-responsive", 
      });
  }

  openDialogAssignTime( employee:any ){

    let width : string = '';
    let height : string = '';

    if(screen.width >= 800) {
      width = "600px";
      height = "280px";
    }
      this.dialog.open(AssignTimeComponent, {
        data: employee,
        width: `${width}`|| "",
        height:`${height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  }


  

}
