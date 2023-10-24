import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, debounceTime } from 'rxjs';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-edit-employee-skills',
  templateUrl: './edit-employee-skills.component.html',
  styleUrls: ['./edit-employee-skills.component.scss']
})
export class EditEmployeeSkillsComponent implements OnInit {

  employee : any;
  confirm : boolean = false;
  myForm!: FormGroup;
  isLoading : boolean = false;

  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();

  noMatches : boolean = false;
  skill : any;

  itemSearch : string = '';
  mostrarSugerencias: boolean = false;
  sugested : string= "";
  suggested : any[] = [];
  spinner : boolean = false;
  fade : boolean = false;
  search : boolean = true;
  product  : any[] = [];
  employees : any []=[];
  arrSkill : any []=[];
  skillFound : any = null;
  isSkillFound : boolean = false;
// end search

  errorLabel : boolean= false;

  constructor(
            private fb: FormBuilder,
             private dialogRef : MatDialogRef<EditEmployeeSkillsComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private employeeService : EmployeeService,
             private errorService : ErrorService,
  ) { 
    
    this.myForm = this.fb.group({
      itemSearch:  [ '', Validators.required ],
    });
  }

  ngOnInit(): void {

    this.employee = this.data;

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited)this.isLoading = false; this.close()})

  

    this.myForm.get('itemSearch')?.valueChanges.subscribe(newValue => {
      this.itemSearch = newValue;

      if(this.itemSearch === '' ){
        this.isSkillFound = false;
        this.skill = null;
      }
      if(this.itemSearch !== '' && !this.isSkillFound){
         this.teclaPresionada();
      }else{
        this.suggested = [];
        this.spinner= false;
      }
    });

    this.debouncer
    .pipe(debounceTime(400))
    .subscribe( valor => {

      this.sugerencias(valor);
    });
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
  
  
  teclaPresionada(){
    this.noMatches = false;
    this.debouncer.next( this.itemSearch );  
  };
  
  
  sugerencias(value : string){
      this.spinner = true;
      this.itemSearch = value;
      this.mostrarSugerencias = true;  
      const valueSearch = value.toUpperCase();
      this.employeeService.searchSkillByName(valueSearch)
      .subscribe ( ({skill} )=>{
        if(skill.length !== 0){
          // this.arrArticlesSugested = articulos;
          this.suggested = skill.splice(0,10);
            this.spinner = false;
          }else{
            this.spinner = false;
            this.noMatches = true;
            this.myForm.get('itemSearch')?.setValue('');
          }
        }
      )
  }

    
  Search( item: any ){
    setTimeout(()=>{
      this.mostrarSugerencias = false;
      this.spinner = false;
      this.isSkillFound = true;
      this.suggested = [];
      this.myForm.get('itemSearch')?.setValue(item.name);
      this.noMatches = false;
    },500)
    this.skill = item;
  }
    // search

    delSelectedSkill(){
        this.mostrarSugerencias = false;
        this.spinner = false;
        this.isSkillFound = false;
        this.suggested = [];
        this.myForm.get('itemSearch')?.setValue('');
        this.noMatches = false;
        this.skill = null;
        this.errorLabel = false;
    }
  
  
    closeNoMatch(){
      this.noMatches = false;
    }
  

  onSaveForm(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    if(this.skill === null){
      return;
    }

    if( this.employee.skillList.includes(this.skill.name) ){
       this.errorLabel = true;
       return;
    }

    const updatedEmployee = { ...this.employee };
    updatedEmployee.skillList.push(this.skill.name)

    this.employeeService.updateEmployeeById(updatedEmployee, this.employee._id).subscribe( 
      ({success})=>{
        this.isLoading = false;
        if(success){
          this.close();
          this.errorLabel = false;
          this.employeeService.updateEditingEmployee$.emit(true);
        }
      });
  }

  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}
