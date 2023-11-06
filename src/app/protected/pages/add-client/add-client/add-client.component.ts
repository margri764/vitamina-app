import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  myForm!: FormGroup;
  confirm : boolean = false;
  isLoading : boolean = false;
  tempEmployee : any;


  constructor(
             private fb: FormBuilder,
              private dialogRef : MatDialogRef<AddClientComponent>,
              private errorService : ErrorService,
              private validatorService : ValidatorService,
              private dialog : MatDialog,
              private authService : AuthService
              // private store : Store <AppState>,

  ) {
    this.myForm = this.fb.group({
      company_name: [ '', [Validators.required] ],
      industry_type:  [ '', [Validators.required]],
      email:  [ '', [ Validators.pattern(this.validatorService.emailPattern)]],
   
    });
  }

  ngOnInit(): void {

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
  
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

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;


    
    this.authService.createClient(this.myForm.value).subscribe( 
      ( {success, client})=>{
        if(success){
          this.isLoading = false;
          this.authService.updateEditingUser$.emit(true);
          this.close();
        }
      });
  }



  validField( field: string ) {
    return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
}

}
