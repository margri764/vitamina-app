import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { Subject, Subscription, debounceTime, take } from 'rxjs';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { PageEvent } from '@angular/material/paginator';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { MatAccordion } from '@angular/material/expansion';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddClientComponent } from '../../add-client/add-client/add-client.component';
import { AskGenericDeleteComponent } from 'src/app/protected/messages/ask-generic-delete/ask-generic-delete/ask-generic-delete.component';
import { UpdateClientComponent } from '../../update-client/update-client/update-client.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})

export class ClientComponent implements OnInit {

  @HostListener('window:scroll') onScroll(e: Event): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const contentHeight = document.body.offsetHeight;
    if(this.phone){
       if (scrollPosition >= contentHeight - 100 && !this.isLoading) {
         this.loadInfiniteScroll();
       }
    }
 }

// start search
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Output() onEnter   : EventEmitter<string> = new EventEmitter();
  debouncer: Subject<string> = new Subject();


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

  // paginator
  length = 50;
  pageSize = 100;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 25];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent!: PageEvent;
  // paginator

  // accordion
  @ViewChild(MatAccordion)  accordion!: MatAccordion;
  panelOpenState = false;
  showLabelTempOrder : boolean = false;
  articleSuscription!: Subscription;
  alert : string = '';
  toogle : boolean = false;
  hidden : boolean = false;
  login : boolean = false;
  // accordion

  height : string = '';
  width : string = '';

  constructor(
              private authService : AuthService,
              private dialog : MatDialog,
              private errorService : ErrorService,
              private store : Store <AppState>,
              private cookieService : CookieService,
              private fb : FormBuilder,


  ) { 
        
  // if(getDataSS("logged") === true || getDataLS("logged") == true){
  //   this.cookieService.get('token');
  //   this.login = true;
  // }
    (screen.width <= 800) ? this.phone = true : this.phone = false;

    this.myForm = this.fb.group({
      itemSearch:  [ '',  ],
    });   
  }


  ngOnInit(): void {
    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
    this.authService.updateEditingUser$.subscribe( (emmited)=>{ if(emmited){this.isLoading = true; this.getInitialClients()} });
    
    this.getInitialClients();

     
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

 getInitialClients(){
  this.isLoading = true;

  this.authService.getClientsPaginator(this.pageIndex, this.pageSize).subscribe(
    ({clients, pagination})=>{
      this.clients = clients;
      this.dataTableActive = clients;
      this.isLoading = false;
      this.length = pagination.total_reg;
    })
}


visibility(){
  this.toogle = !this.toogle
}

viewProject( project:any){
  // console.log(project);
  // if(screen.width >= 800) {
  //   this.width = "600px";
  //   this.height = "650px";
  // }

  //   this.dialog.open(ViewProjectComponent, {
  //     data:  project,
  //     width: `${this.width}`|| "",
  //     height:`${this.height}`|| "",
  //     panelClass:"custom-modalbox-edit",
  //   });
}


loadInfiniteScroll(){
  // this.pageIndex++;
  // this.authService.getClientsPaginator(this.pageIndex, this.pageSize).subscribe(
  //   ({lients, pagination})=>{
  //     this.lients = [...this.lients, ...lients];
  //     this.dataTableActive = lients;
  //     this.isLoading = false;
  //     this.length = pagination.total_reg;
  //   })
}

handlePageEvent(e: PageEvent) {


  this.pageEvent = e;
  this.length = e.length;
  this.pageSize = e.pageSize;
  this.pageIndex = e.pageIndex;
  this.isLoading= true;

    if(this.pageIndex === 0){
      this.isLoading = false;
      return
    }

    this.authService.getClientsPaginator(this.pageIndex, this.pageSize,).subscribe(
      ({clients})=>{
        this.clients = clients;
        this.dataTableActive = clients;
        this.isLoading = false
      })
}

deleteClient(client : any){

    if(screen.width >= 800) {
      this.width = "400px";
      this.height = "280px";
  
    }
      this.dialog.open(AskGenericDeleteComponent, {
        data: client.company_name,
        disableClose: true,
        width: `${this.width}`|| "",
        height:`${this.height}`|| "",
        panelClass:"custom-modalbox-edit",
      });
  
      this.authService.authDelClient$.pipe(
        take(1)
      ).subscribe( (auth: any)=> { // el ask-edit dispara ui boolean si se elige CONTINUAR con la acción
        this.isLoading = true;
        if(auth){
          this.authService.deleteClientById(client._id).subscribe( 
            ({success})=>{
              if(success){
              this.getInitialClients();
              this.isLoading = false;
              }
            })
        }
      })
    
  
  
}

editClient(client: any){

  if(screen.width >= 800) {
    this.width = "590px";
    this.height = "510px";

  }
    this.dialog.open(UpdateClientComponent, {
      data: client,
      disableClose: true,
      width: `${this.width}`|| "",
      height:`${this.height}`|| "",
      panelClass:"custom-modalbox-edit",
    });

}



addClient(){

  if(screen.width >= 800) {
    this.width = "450px";
    this.height ="520px";
  }
  this.dialog.open(AddClientComponent, {
    width: `${this.width}`|| "",
    height:`${this.height}`|| "",
    disableClose: true,
    panelClass:"custom-modalbox-NoMoreComponent", 
  });

}

   // search
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


ngOnDestroy(): void {
  if (this.articleSuscription) {
    this.articleSuscription.unsubscribe();
  }
}


}
