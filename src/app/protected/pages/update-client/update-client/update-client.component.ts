import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/protected/services/auth/auth.service';
import { ErrorService } from 'src/app/protected/services/error/error.service';
import { ValidatorService } from 'src/app/protected/services/validator/validator.service';

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {

  myForm!: FormGroup;
  confirm : boolean = false;
  isLoading : boolean = false;
  tempEmployee : any;
  client: any;


  constructor(
             private fb: FormBuilder,
              private dialogRef : MatDialogRef<UpdateClientComponent>,
              private errorService : ErrorService,
              private validatorService : ValidatorService,
              private authService : AuthService,
             @Inject(MAT_DIALOG_DATA) public data: any,


  ) {
    this.myForm = this.fb.group({
      company_name: [ '', [Validators.required] ],
      industry_type:  [ '', [Validators.required]],
      email:  [ '', [ Validators.pattern(this.validatorService.emailPattern)]],
   
    });
  }

  ngOnInit(): void {

    this.client = this.data;

    this.errorService.closeIsLoading$.subscribe( (emmited)=>{ if(emmited){this.isLoading = false}});
  

    this.myForm = this.fb.group({
      company_name: [ this.client.company_name, [Validators.required] ],
      industry_type:  [ this.client.industry_type, [Validators.required]],
      email:  [ this.client.email, [ Validators.pattern(this.validatorService.emailPattern)]],
   
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

  onSaveForm(){

    if ( this.myForm.invalid ) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    
    this.authService.updateClientById( this.myForm.value, this.client._id).subscribe( 
      ( {success})=>{
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
