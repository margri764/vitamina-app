import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject, debounceTime } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {


  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();

  firstFormGroup = this.fb.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this.fb.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;


  displayedColumns: string[] = ['name', 'industry','email', 'projects','action'];
  dataTableActive : any ;
  
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
// end search

  clients : any []=[];
  isLoading : boolean = false;
  arrClient : any []=[];
  clientFound : any = null;
  isClientFound : boolean = false;
  labelNoFinded : boolean = false;
  phone : boolean = false;

  constructor(
              private authService : AuthService,
              private dialog : MatDialog,
              private errorService : ErrorService,
              private store : Store <AppState>,
              private fb : FormBuilder,
  ) {

    this.myForm = this.fb.group({
      itemSearch:  [ '',  ],
    });   
   }

  ngOnInit(): void {

       //para las busquedas
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


  close(){
    this.mostrarSugerencias = false;
    this.itemSearch = '';
    this.suggested = [];
    this.spinner= false;
    this.myForm.get('itemSearch')?.setValue('');
    this.noMatches = false;
    this.clientFound= null;
    this.isClientFound = false;
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
      this.authService.searchClientByName(valueSearch)
      .subscribe ( ({client} )=>{
        if(client.length !== 0){
          // this.arrArticlesSugested = articulos;
          this.suggested = client.splice(0,10);
          console.log(this.suggested);
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
      this.clientFound = item;
      this.isClientFound = true;
      this.myForm.get('itemSearch')?.setValue('');
      this.suggested = [];
      this.noMatches = false;
    },500)
  }
    // search
  
  
    closeNoMatch(){
      this.noMatches = false;
    }
  
  

}
