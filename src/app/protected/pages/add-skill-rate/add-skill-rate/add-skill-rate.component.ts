import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-add-skill-rate',
  templateUrl: './add-skill-rate.component.html',
  styleUrls: ['./add-skill-rate.component.scss']
})
export class AddSkillRateComponent implements OnInit {

  myForm!: FormGroup;
  confirm : boolean = false;
  isLoading : boolean = false;
  private body : any;
  categories : any [] = [];
  phone : boolean = false;
  selSkill : boolean = false;
  selectedSkill: string | null = null;
  skills : any [] = [];
  arrSkills : any []=[];


  constructor(
             private fb: FormBuilder,
              private dialogRef : MatDialogRef<AddSkillRateComponent>,
              private employeeService : EmployeeService,
              private errorService : ErrorService,
              private dialog : MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

    (screen.width > 800) ? this.phone = false : this.phone = true;

    this.myForm = this.fb.group({
      skillList:  [ '', [Validators.required]],
      rate:  [ '', [Validators.required]],
 
    });
  }

  ngOnInit(): void {

    this.body = this.data;
    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
    this.getAllSkillCategories();
   
  }

  showButton : boolean = false;
  showDelSkill : boolean = false;
  isSkillSelected = false;
  isSelectedSkill = false;
  isCategorySelected = false;
  isRateSelected = false;
  selectedSkills : any [] = [];


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

    this.selectedSkills= this.selectedSkills.filter( (item:any)=> item !== skill);
 
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
    console.log('Valor ingresado:', (event.target as HTMLInputElement).value);
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

    this.isLoading = true;
    this.employeeService.getAllSkillCategories().subscribe( 
      ({success, categories})=>{
        this.isLoading = false;
        if(success){
          this.categories = categories;
          console.log(categories);
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

    // this.employeeService.addNewEmployee(body).subscribe( 
    //   ({success})=>{
    //     this.isLoading = false;
    //     if(success){
    //       this.close();
    //       this.employeeService.updateEditingEmployee$.emit(true);
    //     }
    //   });
  }

 

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}
