import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Store } from '@ngrx/store';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import * as authActions from 'src/app/auth.actions';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.scss']
})
export class SearchClientComponent implements OnInit, OnDestroy {


  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();

  authSubscription! : Subscription;
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
  clients : any []=[];
  isLoading : boolean = false;
  arrClient : any []=[];
  clientFound : any = null;
  isClientFound : boolean = false;
  phone : boolean = false;
  // end search

  // accordion
  @ViewChild(MatAccordion)  accordion!: MatAccordion;
  panelOpenState = false;
  showLabelTempOrder : boolean = false;
  articleSuscription!: Subscription;
  alert : string = '';
  toogle : boolean = false;
  hidden : boolean = false;
  login : boolean = false;
  dialog: any;
  // accordion


  constructor(
              private authService : AuthService,
              private errorService : ErrorService,
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

  deleteClient( client:any){

  }

  editClient( client:any ){

  }

  viewProject( project:any){

    // let width : string = '';
    // let height : string = '';
    // if(screen.width >= 800) {
    //   width = "600px";
    //   height = "650px";
    // }
  
    //   this.dialog.open(ViewProjectComponent, {
    //     data:  project,
    //     width: `${width}`|| "",
    //     height:`${height}`|| "",
    //     panelClass:"custom-modalbox-edit",
    //   });
  }

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
      this.authService.searchClientByName(valueSearch)
      .subscribe ( ({client} )=>{
        if(client.length !== 0){
          // this.arrArticlesSugested = articulos;
          this.suggested = client.splice(0,10);
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
    closeNoMatch(){
      this.noMatches = false;
    }

    // search

    setClient:boolean = false;
    selectClient( client:any){

      this.store.dispatch(authActions.setClient( {client} ));
      this.setClient = true;
    }

    ngOnDestroy(): void {
      if(this.authSubscription){
        this.authSubscription.unsubscribe();
  
      }
    }


}
