import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, debounceTime } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ProjectSkillsComponent } from 'src/app/protected/messages/project-skills/project-skills/project-skills.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  isLinear = false;
   myForm! : FormGroup;
  isLoading : boolean = false;
  confirm: boolean = false;

  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.fb.group({
    name: ['', ],
    features: ['',],
  });
  


  constructor(
              private fb : FormBuilder,
              private employeeService : EmployeeService,
              private dialog : MatDialog,
              // private authService : AuthService,
              // private errorService : ErrorService,
              // private store : Store <AppState>,
  ) {


      this.myForm = this.fb.group({
        firstCtrl: ['', Validators.required],
      });
   
   }

  ngOnInit(): void {


  }

  onSaveForm(){

  }

  arrFeatures : any [] = [];

  onEnterKey(event: Event) {

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

    this.employeeService.suggestEmployeeBySkill('javascript').subscribe( 
      ( {success})=>{
        if(success){
          this.isLoading = false;
        }
      });
  }

  openDialogSkills(){

    
    let width = "";
    let height ="";

      if(screen.width >= 800) {
        width = "600px";
        height ="520px";
      }
    this.dialog.open(ProjectSkillsComponent, {
      // data: body,
      // width: `${width}`|| "",
      // height:`${height}`|| "",
      panelClass:"custom-modalbox-responsive", 
    });
}


  

}
