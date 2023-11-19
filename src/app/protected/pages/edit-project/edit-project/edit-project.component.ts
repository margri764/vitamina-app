import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
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
import { ActivatedRoute, Router } from '@angular/router';
import { getDataSS, saveDataSS } from 'src/app/protected/Storage';
import { ReviewedProjectsSkillsComponent } from 'src/app/protected/messages/reviewed-projects-skills/reviewed-projects-skills/reviewed-projects-skills.component';
import { EditionAssignTimeComponent } from '../../edition-assign-time/edition-assign-time.component';
import { WrongActionMessageComponent } from 'src/app/protected/messages/wrong-action-message/wrong-action-message/wrong-action-message.component';

type StringArray = string[];


interface projectTime {
  _id: string;
  name: string,
  hourly_rate: number,
  time: number;
  availability: boolean
}

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  displayedColumns: string[] = ['name', 'state','rate','action'];
  dataTableActive : any ;

  isLinear = false;
  myForm!: FormGroup;
  firstFormGroup!: FormGroup;
  private projectSubscription!: Subscription; 
  isLoading: boolean = false;
  confirm: boolean = false;
  selection: boolean = false;
  projectSkills: any []=[];
  arrFeatures : any [] = [];
  arrProjectTime : projectTime [] =[];
  showDeleteIcon: boolean[] = new Array(this.projectSkills.length).fill(false);
  showDeleteIconFeature: boolean[] = new Array(this.arrFeatures.length).fill(false);
  showDelIconAssigEmployee: boolean[] = new Array(this.arrProjectTime.length).fill(false);
  employees : any [] = [];
  noSuggestedEmployees: boolean = false;
  accumProjectTime: number = 0;
  client : any;
  isSetClient: boolean = false;
  isProjectScope: boolean = false;
  myFormInput!: FormGroup;
  projectId : string = '';
  reviewedProject : any;
  total: number = 0;
  showSuggestedEmployees : boolean = false;

  constructor(
              private fb : FormBuilder,
              private employeeService : EmployeeService,
              private dialog : MatDialog,
              private store : Store <AppState>,
              private validatorService : ValidatorService,
              private errorService : ErrorService,
              private projectService : ProjectService,
              private router : Router,
              private activatedRoute : ActivatedRoute
              // private authService : AuthService,
  ) {

    this.activatedRoute.params.subscribe( 
      ( {id} )=>{ this.projectId = id});

  }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.subscribe( emmited => {if(emmited)this.isLoading = false});

    this.store.select('auth')
    .pipe(
      filter( ({reviewedProjects})=>  reviewedProjects != null && reviewedProjects.length != 0),
    ).subscribe(
      ({ reviewedProjects })=>{
        this.getProjectById(reviewedProjects);
        const projectTime = getDataSS('projectTime');
        this.getProjectTime(projectTime);

      })

      this.projectService.projectSkillsRevProj$.subscribe((skills: StringArray) => { this.projectSkills = skills;   });
      this.projectService.projectTimeRevProj$.subscribe((projectTime: projectTime) => {  this.getProjectTime(projectTime) });

    // this.projectSkills = getDataSS('projectSkills');
    
      
      this.firstFormGroup = this.fb.group({
        name: ['' ],
        features: this.fb.array([]),
        addFeature: [''],
        date: [''],
        description: [''],
        duration:  [ '' ]
      });


  }

  getProjectById( reviewedProjects:any ){
    
    const project = reviewedProjects.filter( (item:any) => item._id === this.projectId);
    this.reviewedProject = project[0];

    this.projectSkills = this.reviewedProject.relatedSkills;
    const duration = this.getDuration();

    
      this.firstFormGroup = this.fb.group({
        name: [this.reviewedProject.project_scope.name, ],
        features: this.fb.array([]),
        addFeature: [],
        date: [this.reviewedProject.project_scope.estimatedDeliveryDate],
        description: [this.reviewedProject.project_scope.description],
        duration:  [ duration, [this.validatorService.positiveNumberWithDecimals()] ]
      });

      this.populateForm(this.reviewedProject.project_scope.main_features)


  }


  populateForm(data: any) {

    const detalleItemsArray = this.firstFormGroup.get('features') as FormArray;
    detalleItemsArray.clear();

    data.forEach((feature: any) => {
      detalleItemsArray.push(this.fb.group({
        descripcion: feature,
        
      }));
    });
  }


  getDetalleItemsControls() {
    return (this.firstFormGroup.get('features') as FormArray).controls;
  }

  getDuration(){

    console.log(this.reviewedProject.duration);

    let projectTime : projectTime []=[];

    this.reviewedProject.duration.forEach((item:any)=>{

      projectTime.push( {_id:item.employee._id,  name: item.employee.name,  hourly_rate: item.hourly_rate, time: item.assigned_hours, availability: item.employee.availability})
      })

      saveDataSS("projectTime", projectTime);
 
      
      this.total = this.reviewedProject.duration.reduce((total: any, employee: any ) => total + (employee.assigned_hours * employee.hourly_rate), 0);
      return this.reviewedProject.duration.reduce((total: any, employee: any ) => total + employee.assigned_hours, 0);
  }

  suggestEmployees(){

    this.showSuggestedEmployees = true;
  }  

  checkProjectScope(){

    const name = this.firstFormGroup.get('name')?.value
    const duration = this.firstFormGroup.get('duration')?.value

    if( name === ''|| duration === '' || this.firstFormGroup.invalid || this.projectSkills.length === 0){
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
    const selectedDate = this.firstFormGroup.get('date')?.value;
    
    if (selectedDate) {
      estimatedDeliveryDate = selectedDate.toISOString();
    }
    
    const project_scope = {
                            name: this.firstFormGroup.get('name')?.value,
                            description: this.firstFormGroup.get('description')?.value,
                            main_features: this.arrFeatures,
                            estimatedDeliveryDate
                          }

    const client = this.client._id;
    
    const body : Project = {
                            client,
                            employee,
                            project_scope,
                            duration,
                            relatedSkills : this.projectSkills
                           }

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

    this.firstFormGroup.get('name')?.setValue('');
    this.firstFormGroup.get('duration')?.setValue('');
    this.firstFormGroup.get('description')?.setValue('');
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
  }

  onEnterKey(event: Event) {
    event.stopPropagation();
  
    const data = [...this.reviewedProject.project_scope.main_features];
  
    const newFeature = this.firstFormGroup.get('addFeature')?.value;

  
    if (event instanceof KeyboardEvent && event.key === 'Enter') {
    console.log(newFeature);

      const updatedProjectScope = {
        ...this.reviewedProject.project_scope,
        main_features: [...data, newFeature],
      };
  
      this.reviewedProject = {
        ...this.reviewedProject,
        project_scope: updatedProjectScope,
      };

      const detalleItemsArray = this.firstFormGroup.get('features') as FormArray;
      detalleItemsArray.clear();
      
      updatedProjectScope.main_features.forEach((feature: any) => {
        detalleItemsArray.push(this.fb.group({
          descripcion: feature,
        }));
      });
  
      this.firstFormGroup.controls['addFeature'].setValue('');
    }
  }
  

  delFeature( feature:any ){

    console.log(feature);
    const data = [...this.reviewedProject.project_scope.main_features];

    const updatedProjectScope = {
      ...this.reviewedProject.project_scope,
      main_features: data.filter((item: any) => item !== feature),
    };

    this.reviewedProject = {
      ...this.reviewedProject,
      project_scope: updatedProjectScope,
    };


    const detalleItemsArray = this.firstFormGroup.get('features') as FormArray;
    detalleItemsArray.clear();
    
    updatedProjectScope.main_features.forEach((feature: any) => {
      detalleItemsArray.push(this.fb.group({
        descripcion: feature,
      }));
    });
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
    return this.firstFormGroup.controls[field].errors && this.firstFormGroup.controls[field].touched;
}

closeNotMatching(){
  this.noSuggestedEmployees = false;
}

remainingTime: any;
getTotalHs(){

  if (!this.arrProjectTime || this.arrProjectTime.length === 0) {
    return ;
  }
  const duration = this.firstFormGroup.get('duration')?.value;

  this.accumProjectTime = this.arrProjectTime.reduce((total, time) => total + time.time, 0);
  this.remainingTime = duration - this.accumProjectTime; 
  return  this.remainingTime
}

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
    let projectSkills : any[]=[];

    const projectSkillsString = JSON.stringify(this.projectSkills);
    const relatedSkillsString = JSON.stringify(this.reviewedProject.relatedSkills);

    if(projectSkillsString === relatedSkillsString){
      projectSkills = this.reviewedProject.relatedSkills
    }else{
      projectSkills = this.projectSkills
    }

    this.dialog.open(ReviewedProjectsSkillsComponent, {
      data: projectSkills,
      disableClose: true,
      panelClass:"custom-modalbox-responsive", 
    });
}

openDialogEditionAssignTime( employee:any ){
  const duration = this.firstFormGroup.get('duration')?.value

  let width : string = '';
  let height : string = '';

  if(screen.width >= 800) {
    width = "600px";
    height = "310px";
  }
    this.dialog.open(EditionAssignTimeComponent, {
      data: {employee, duration: duration},
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
      disableClose: true,
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

openGenericMsgAlert(msg : string){

  let width : string = '';
  let height : string = '';

  if(screen.width >= 800) {
    width = "350px"
    height ="350px";
  }

  this.dialog.open(WrongActionMessageComponent, {
    data: msg,
    width: `${width}`|| "",
    height:`${height}`|| "",
    disableClose: true,
    panelClass:"custom-modalbox-NoMoreComponent", 
  });

}

ngOnDestroy(): void {
  this.store.dispatch(authActions.unSetRevProjectSkills())
  if (this.projectSubscription) {
    this.projectSubscription.unsubscribe();
  }
}


  

}
