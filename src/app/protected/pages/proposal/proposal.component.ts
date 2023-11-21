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
import { Router } from '@angular/router';
import { ProposalService } from '../../services/proposal/proposal.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';



@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {

 
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


  displayedColumns: string[] = ['client', 'proposalName', 'state','action'];
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

  proposals : any []=[];
  isLoading : boolean = false;
  arrProposal : any []=[];
  proposalFound : any = null;
  isProposalFound : boolean = false;
  // labelNoFinded : boolean = false;
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

  durationInSeconds = 30;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom'

  constructor(
              private authService : AuthService,
              private dialog : MatDialog,
              private errorService : ErrorService,
              private proposalService : ProposalService,
              private store : Store <AppState>,
              private cookieService : CookieService,
              private fb : FormBuilder,
              private router : Router,
              private _snackBar: MatSnackBar



  ) { 
        
 
    (screen.width <= 800) ? this.phone = true : this.phone = false;

    this.getInitialProposal();


    this.myForm = this.fb.group({
      itemSearch:  [ '',  ],
    });   
  }


  ngOnInit(): void {
    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
    

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

 getInitialProposal(){
  this.isLoading = true;

  this.proposalService.getAllProposal(this.pageIndex, this.pageSize).subscribe(
    ({proposals, pagination})=>{
      this.proposals = proposals;
      this.dataTableActive = proposals;
      this.isLoading = false;
      this.length = pagination.total_reg;
    })
}

downloadPdf(files:any) {
  if (files && files.data) {
    const blob = new Blob([this.base64ToArrayBuffer(files.data)], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.target = '_blank';
    link.download = files.name;

    link.click();
  }else{
    this.openSnackBar();
  }
}

base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}


visibility(){
  this.toogle = !this.toogle
}

viewproposal( proposal:any){

}

loadInfiniteScroll(){
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

    this.proposalService.getAllProposal(this.pageIndex, this.pageSize,).subscribe(
      ({proposals})=>{
        this.proposals = proposals;
        this.dataTableActive = proposals;
        this.isLoading = false
      })
}

deleteProposal(proposal : any){
  
}


openSnackBar() {
  
  
  let msg = `Oops! It seems there isn't a file to download.`
 
  
    this._snackBar.open( msg, 'close', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    })
  }



addClient(){

  if(screen.width >= 800) {
    this.width = "600px";
    this.height ="770px";
  }

  // this.dialog.open(NewcustomerComponent, {
  //   width: `${this.width}`|| "",
  //   height:`${this.height}`|| "",
  //   panelClass:"custom-modalbox-NoMoreComponent", 
  // });
}

   // search
close(){
  this.mostrarSugerencias = false;
  this.itemSearch = '';
  this.suggested = [];
  this.spinner= false;
  this.myForm.get('itemSearch')?.setValue('');
  this.noMatches = false;
  this.proposalFound= null;
  this.isProposalFound = false;
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
    this.proposalService.searchProposalByClient(valueSearch)
    .subscribe ( ({proposals} )=>{
      if(proposals.length !== 0){
        // this.arrArticlesSugested = articulos;
        this.suggested = proposals.splice(0,10);
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
    this.proposalFound = item;
    this.isProposalFound = true;
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