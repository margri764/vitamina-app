import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, debounceTime } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { EmployeeService } from 'src/app/protected/services/employee/employee.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.scss']
})
export class SearchEmployeeComponent implements OnInit {

  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();

  // start search
  myForm! : FormGroup;
  noMatches : boolean = false;
  itemSearch : string = '';
  mostrarSugerencias: boolean = false;
  sugested : string= "";
  suggested : any[] = [];
  spinner : boolean = false;
  fade : boolean = false;
  search : boolean = true;
  product  : any[] = [];
  employees : any []=[];
  isLoading : boolean = false;
  arrEmployee : any []=[];
  employeeFound : any = null;
  isEmployeeFound : boolean = false;
  phone : boolean = false;
  // end search


  constructor(
              private authService : AuthService,
              private errorService : ErrorService,
              private employeeService : EmployeeService,
              private store : Store <AppState>,
              private fb : FormBuilder,
  ) { 

    this.myForm = this.fb.group({
      itemSearch:  [ '',  ],
    });  
  }

  ngOnInit(): void {

           this.myForm.get('itemSearch')?.valueChanges.subscribe(newValue => {
            this.itemSearch = newValue;
      
             console.log(this.myForm.get('itemSearch')?.value);
            if(this.itemSearch !== ''){
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

  deleteEmployee( employee:any){

  }

  editEmployee( employee:any ){

  }

  addEmployee(  ){

  }

  // viewProject( project:any){

  //   let width : string = '';
  //   let height : string = '';
  //   if(screen.width >= 800) {
  //     width = "600px";
  //     height = "650px";
  //   }
  
  //     this.dialog.open(ViewProjectComponent, {
  //       data:  project,
  //       width: `${width}`|| "",
  //       height:`${height}`|| "",
  //       panelClass:"custom-modalbox-edit",
  //     });
  // }

  // search
  teclaPresionada(){
    this.noMatches = false;
    this.debouncer.next( this.itemSearch );  
  };
  
  
  sugerencias(value : string){
      this.spinner = true;
      this.itemSearch = value;
      this.mostrarSugerencias = true;  
      const valueSearch = value.toUpperCase();
      this.employeeService.searchEmployeeByName(valueSearch)
      .subscribe ( ({employee} )=>{
        if(employee.length !== 0){
          // this.arrArticlesSugested = articulos;
          this.suggested = employee.splice(0,10);
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
      this.mostrarSugerencias = true;
      this.spinner = false;
      this.fade = false;
      this.employeeFound = item;
      this.isEmployeeFound = true;
      this.myForm.get('itemSearch')?.setValue('');
      this.suggested = [];
      this.noMatches = false;
    },500)
  }

    close(){
      this.mostrarSugerencias = false;
      this.itemSearch = '';
      this.suggested = [];
      this.spinner= false;
      this.myForm.get('itemSearch')?.setValue('');
      this.noMatches = false;
      this.employeeFound= null;
      this.isEmployeeFound = false;
    }
    closeNoMatch(){
      this.noMatches = false;
    }

    // search


}
