import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit {

  project : any;
  confirm : boolean = false;
  constructor(
            //  private errorService: ErrorService,
             private dialogRef : MatDialogRef<ViewProjectComponent>,
             @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.project = this.data;
    console.log(this.project);
  }

  close(){
    this.dialogRef.close();
  }

  continue(){
    this.confirm = true;
    // this.errorService.authDelClient$.emit(true),
    setTimeout( ()=>{
      this.dialogRef.close();
    },500)


  }

  goToEmployee( employee:any ){
    
  }
}
