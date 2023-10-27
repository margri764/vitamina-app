import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { GenericSuccessComponent } from '../../generic-success/generic-success/generic-success.component';
import * as authActions from 'src/app/auth.actions';

@Component({
  selector: 'app-project-skills',
  templateUrl: './project-skills.component.html',
  styleUrls: ['./project-skills.component.scss']
})
export class ProjectSkillsComponent implements OnInit {


  myForm!: FormGroup;
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
  tempEmployee : any;



  constructor(
             private fb: FormBuilder,
              private dialogRef : MatDialogRef<ProjectSkillsComponent>,
              private employeeService : EmployeeService,
              private errorService : ErrorService,
              private dialog : MatDialog,
              private store : Store <AppState>,
              @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

    (screen.width > 800) ? this.phone = false : this.phone = true;

    this.myForm = this.fb.group({
      hourly_rate:  [ '', [Validators.required]],
 
    });

  }

  ngOnInit(): void {

    // toDo!!!
    //si entro aca desde las notificaciones el "body" con los datos basicos del empleado tengo q guardarlos en algun lugar (esto esta xq puedo crear los datos generales y mas tarde querer agregar las skill y el rate)

    this.store.select('auth')
    .pipe(
      filter( ({tempEmployee})=>  tempEmployee != null && tempEmployee != undefined),
    ).subscribe(
      ({tempEmployee})=>{
        this.tempEmployee = tempEmployee;
        this.isLoading = false;
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
        console.log(index);
        this.arrSkills.splice(index, 1);
      }
    } else {
      target.classList.add('skillSelected');
      this.isSkillSelected = !this.isSkillSelected;
      this.isCategorySelected = false;
      this.isSelectedSkill = false;

      this.arrSkills.push(skill);
    }

    this.showButton = true;
    this.selectedSkills = this.arrSkills;
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
    console.log(this.selectedSkills);

    this.selectedSkills= this.selectedSkills.filter( (item:any)=> item !== skill);
    this.arrSkills = []
    console.log(this.selectedSkills);
 
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

  onBlur() {
    this.isRateSelected = false;

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


    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const updatedEmployee = { ...this.tempEmployee };
    updatedEmployee.skillList = this.selectedSkills;
    updatedEmployee.hourly_rate = this.myForm.get('hourly_rate')?.value;

  
    this.employeeService.updateEmployeeById(updatedEmployee, this.tempEmployee._id).subscribe( 
      ({success})=>{
        this.isLoading = false;
        if(success){
          this.store.dispatch(authActions.unSetTempEmployee());
          this.employeeService.updateEditingEmployee$.emit(true)
          this.close();
          setTimeout(()=>{ this.openDialogSuccesss('Employee created successfully!!'); },900);
        }
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

  openDialogSkillRate( body:any ){
  }
    

 

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}
