import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ProjectSkillsComponent } from 'src/app/protected/messages/project-skills/project-skills/project-skills.component';
import { AssignTimeComponent } from '../../assign-time/assign-time/assign-time.component';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';
import * as authActions from 'src/app/auth.actions';
import { Project } from 'src/app/protected/interfaces/project';
import { GenericSuccessComponent } from 'src/app/protected/messages/generic-success/generic-success/generic-success.component';
import { ProjectService } from 'src/app/protected/services/project/project.service';
import { log } from 'console';
import { AskSendProposalComponent } from 'src/app/protected/messages/ask-send-proposal/ask-send-proposal/ask-send-proposal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'state','rate','action'];
  dataTableActive : any ;

  isLinear = false;
   myForm!: FormGroup;
   firstFormGroup!: FormGroup;
   secondFormGroup!: FormGroup;
   private projectSubscription!: Subscription; 
  isLoading: boolean = false;
  confirm: boolean = false;
  selection: boolean = false;
  projectSkills: any []=[];
  arrFeatures : any [] = [];
  arrProjectTime : any [] =[];
  showDeleteIcon: boolean[] = new Array(this.projectSkills.length).fill(false);
  showDeleteIconFeature: boolean[] = new Array(this.arrFeatures.length).fill(false);
  showDelIconAssigEmployee: boolean[] = new Array(this.arrProjectTime.length).fill(false);
  employees : any [] = [];
  noSuggestedEmployees: boolean = false;
  accumProjectTime: number = 0;
  client : any;
  isSetClient: boolean = false;
  isProjectScope: boolean = false;



  
  constructor(
              private fb : FormBuilder,
              private employeeService : EmployeeService,
              private dialog : MatDialog,
              private store : Store <AppState>,
              private validatorService : ValidatorService,
              private errorService : ErrorService,
              private projectService : ProjectService,
              private router : Router
              // private authService : AuthService,
  ) {
   
   }


  ngOnInit(): void {

    this.errorService.closeIsLoading$.subscribe( emmited => {if(emmited)this.isLoading = false})

    this.store.select('auth')
    .pipe(
      filter( ({client})=>  client != null && client.length != 0),
    ).subscribe(
      ({projectSkills, projectTime, client})=>{
        this.projectSkills = projectSkills;
        this.getProjectTime(projectTime);
        this.client = client;
        this.getTotal();

      })

      this.myForm = this.fb.group({
   
      });

      this.firstFormGroup = this.fb.group({
        // date1: [''],

      });

      this.secondFormGroup = this.fb.group({
        name: ['', ],
        features: [''],
        date: [''],
        description: [''],
        duration:  [ '', [this.validatorService.positiveNumberWithDecimals()] ]
      });

  }



  checkProjectScope(){

    const name = this.secondFormGroup.get('name')?.value
    const duration = this.secondFormGroup.get('duration')?.value

    if( name === ''|| duration === '' || this.secondFormGroup.invalid || this.projectSkills.length === 0){
      this.isProjectScope = false;
    }else{
      this.isProjectScope = true;

    }

  }

  onSaveForm(){

    let employee: any [] = [];
    
    this.confirm = true;

    this.arrProjectTime.map( (item:any)=>{ employee.push(item._id)});
    const duration: any[] = this.arrProjectTime.map((item: any) => ({
      employee: item._id,
      assigned_hours: item.time,
      hourly_rate: item.hourly_rate
    }));

    let estimatedDeliveryDate : any;
    const selectedDate = this.secondFormGroup.get('date')?.value;
    
    if (selectedDate) {
      estimatedDeliveryDate = selectedDate.toISOString();
    }
    
    const project_scope = {
                            name: this.secondFormGroup.get('name')?.value,
                            description: this.secondFormGroup.get('description')?.value,
                            main_features: this.arrFeatures,
                            estimatedDeliveryDate
                          }

    const client = this.client._id;
    
    const body : Project = {
                            client,
                            employee,
                            project_scope,
                            duration
                           }
    console.log(body);

    this.projectService.createProject(body, 'create').subscribe(
      ( {success, project} )=>{
        if(success){
          this.openDialogSuccesss("Project created successfully!");
          this.resetProject();

          this.projectSubscription = this.projectService.emitSuccessProject$.subscribe( 
            (auth)=>{
              if(auth){
                setTimeout(()=>{ this.openDialogSendProject("Do you want send the proposal?") },400)
              }
            })

          this.projectService.authSendProposal$.subscribe( (emmited)=>{ 
            if(emmited){
            this.router.navigateByUrl(`/view-project/${project._id}`)
            }else if(!emmited){
              location.reload();
            }
          } )

        }
      })

  }

  resetProject(){

    this.secondFormGroup.get('name')?.setValue('');
    this.secondFormGroup.get('duration')?.setValue('');
    this.secondFormGroup.get('description')?.setValue('');
    this.arrProjectTime = [];
    this.projectSkills = [];
    this.employees = [];
    this.dataTableActive= [];
    this.store.dispatch(authActions.unSetClient());
    this.store.dispatch(authActions.unSetProjectSkills());
    this.store.dispatch(authActions.unSetEmployeeProjectTime());

  }

  deleteAssignedEmployee( employee:any){

    const id = employee.id;
    console.log(id);
    this.store.dispatch( authActions.deleteAssignedEmployee({ id }) );
    this.arrProjectTime = this.arrProjectTime.filter( (item:any)=> item.id !== id)

  }

  deleteSkill( skill:any){
    this.projectSkills= this.projectSkills.filter( (item:any)=> item !== skill);
    this.store.dispatch(authActions.setProjectSkills({projectSkills : this.projectSkills}))
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
          this.checkProjectScope();
          if(success){
            this.employees = employees;
            this.dataTableActive = employees;
            this.isLoading = false;
          }else if(employees.length === 0){
            this.noSuggestedEmployees = true;
          }
        });
  }

validField( field: string ) {
    return this.secondFormGroup.controls[field].errors && this.secondFormGroup.controls[field].touched;
}

closeNotMatching(){
  this.noSuggestedEmployees = false;
}

getTotalHs(){

  // if (!this.arrProjectTime || this.arrProjectTime.length === 0) {
  //   return ;
  // }
 let total = 0;
  const duration = this.secondFormGroup.get('duration')?.value;
  this.accumProjectTime = this.arrProjectTime.reduce((total, time) => total + time.time, 0);
  
   total = duration - this.accumProjectTime; 
  
  return total 

}

total: number = 0;

getTotal(){

  if(this.arrProjectTime.length === 0){
    return 0
  }
 this.total = this.arrProjectTime.reduce((total, employee) => total + (employee.hourly_rate * employee.time), 0);

  return this.total;
}

getProjectTime( projectTime:any){
  if(!projectTime) return;
  this.arrProjectTime = projectTime;
  this.getTotalHs();

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
    height = "310px";
  }
    this.dialog.open(AssignTimeComponent, {
      data: employee,
      width: `${width}`|| "",
      height:`${height}`|| "",
      panelClass:"custom-modalbox-edit",
    });
}

openDialogSuccesss( body:any ){

  let width = "";
  let height ="";

    if(screen.width >= 800) {
      width = "400px";
      height ="300px";
    }
  
    this.dialog.open(GenericSuccessComponent, {
      data: body,
      width: `${width}`|| "",
      height:`${height}`|| "",
      panelClass:"custom-modalbox-NoMoreComponent", 
    });
}

openDialogSendProject( body:any ){

  let width = "";
  let height ="";

    if(screen.width >= 800) {
      width = "400px";
      height ="220px";
    }
  
    this.dialog.open(AskSendProposalComponent, {
      data: body,
      width: `${width}`|| "",
      height:`${height}`|| "",
      panelClass:"custom-modalbox-NoMoreComponent", 
    });
}

ngOnDestroy(): void {
  if (this.projectSubscription) {
    this.projectSubscription.unsubscribe();
  }
}


  

}
