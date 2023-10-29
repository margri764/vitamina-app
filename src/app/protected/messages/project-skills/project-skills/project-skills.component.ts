import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { saveDataSS } from 'src/app/protected/Storage';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import * as authActions from 'src/app/auth.actions';

@Component({
  selector: 'app-project-skills',
  templateUrl: './project-skills.component.html',
  styleUrls: ['./project-skills.component.scss']
})
export class ProjectSkillsComponent implements OnInit,OnDestroy {


  confirm : boolean = false;
  isLoading : boolean = true;
  private body : any;
  categories : any [] = [];
  phone : boolean = false;
  selSkill : boolean = false;
  selectedSkill: string | null = null;
  skills : any [] = [];
  arrSkills : any []=[];
  
  showButton : boolean = false;
  showDelSkill : boolean = false;
  isSkillSelected = false;
  isSelectedSkill = false;
  isCategorySelected = false;
  isRateSelected = false;
  selectedSkills : any [] = [];
  projectSkills : any [] = [];

  authSubscription!: Subscription;



  constructor(
              private dialogRef : MatDialogRef<ProjectSkillsComponent>,
              private employeeService : EmployeeService,
              private errorService : ErrorService,
              private dialog : MatDialog,
              private store : Store <AppState>,
              @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

    (screen.width > 800) ? this.phone = false : this.phone = true;



  }

  ngOnInit(): void {

    // toDo!!!
    //si entro aca desde las notificaciones el "body" con los datos basicos del empleado tengo q guardarlos en algun lugar (esto esta xq puedo crear los datos generales y mas tarde querer agregar las skill y el rate)

    this.store.select('auth')
    .pipe(
      filter( ({projectSkills})=>  projectSkills != null && projectSkills.length != 0),
    ).subscribe(
      ({projectSkills})=>{
        this.selectedSkills = projectSkills;
        this.arrSkills = projectSkills;
      })



    this.body = this.data;
    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
    this.getAllSkillCategories();
  }



  onSelect(skill: any, event: MouseEvent) {

    const target = event.target as HTMLElement;
  
    if (target.classList.contains('skillSelected')) {
      target.classList.remove('skillSelected');
      const index = this.arrSkills.indexOf(skill);
      if (index !== -1) {
        this.arrSkills.splice(index, 1);
      }
    } else {
      target.classList.add('skillSelected');
      this.isSkillSelected = true;
      this.isCategorySelected = false;
      this.isSelectedSkill = false;
      this.arrSkills = [...this.arrSkills, skill];
    }

    this.showButton = true;
    this.selectedSkills=  this.arrSkills;
  }

  selectCategory( category:any , event: MouseEvent){

    this.isSkillSelected = false;
    this.isRateSelected = false;
    this.isSelectedSkill = false;
    this.isCategorySelected = true;
    this.skills = category.skillList;
  }

  saveSkills(event: MouseEvent){

    
      const target = event.target as HTMLElement;
    
      if (target.classList.contains('saveSelected')) {
  
        target.classList.remove('saveSelected');
      }else {
        target.classList.add('saveSelected');
      }

      setTimeout( ()=>{
        this.skills = [];
        this.showButton = false;
      },700)


  }

  deleteSkill(skill:any){   

    this.selectedSkills= this.selectedSkills.filter( (item:any)=> item !== skill);
    this.arrSkills = []
    
    const button = document.querySelector(`button.skillSelected[title="${skill}"]`);
    if (button) {
      button.classList.remove('skillSelected');
    }
  
  }

  delSkill(){
    this.isSkillSelected = false;
    this.isCategorySelected = false;
    this.isRateSelected = false;
    this.isSelectedSkill = true;
    this.showDelSkill = !this.showDelSkill;
  }

  onInput(event: Event) {
    this.isSkillSelected = false;
    this.isCategorySelected = false;
    this.isSelectedSkill = false;
    this.isRateSelected = true;

  }
  
  onFocus() {
    this.isSkillSelected = false;
    this.isCategorySelected = false;
    this.isSelectedSkill = false;
    this.isRateSelected = true;
  }

  getAllSkillCategories(){


    this.employeeService.getAllSkillCategories().subscribe( 
      ({success, categories})=>{
        setTimeout(()=>{ this.isLoading = false },1500)
        
        if(success){
          this.categories = categories;
        }
      } )

  }
  
  close(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    setTimeout( ()=>{
      this.dialogRef.close();
    },500)
  }

  onSaveForm(){

    this.confirm = true;
    console.log(this.selectedSkills);
    this.store.dispatch(authActions.setProjectSkills({projectSkills : this.selectedSkills}))
    setTimeout(()=>{ this.close() },300)
   
  }

  ngOnDestroy(): void {
    if(this.authSubscription){
      this.authSubscription.unsubscribe();

    }
  }



}
