import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactusService } from '../../shared/services/contactus/contactus.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  isSubmitted:boolean =false;
  contactusForm:FormGroup;
  constructor(private fb:FormBuilder, private _service:ContactusService, private toastr:ToastrService, private router:Router){
    this.contactusForm = this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required,Validators.email]],
      message:['',[Validators.required]]
    })
  }

  submit(){
    this.isSubmitted = true;
    this.contactusForm.patchValue({
      name : this.contactusForm.value.name.trim(),
      email: this.contactusForm.value.email.trim(),
      message: this.contactusForm.value.message.trim()
    })
    if (this.contactusForm.invalid) {
      this.contactusForm.markAllAsTouched();
      return;
    }
    let jsondata = {
      name: this.contactusForm.value.name,
      email: this.contactusForm.value.email,
      message: this.contactusForm.value.message
    };
    this._service.contactus(jsondata).subscribe(
      (resp:any) => {
        if(resp && resp.errCode===0){
          this.toastr.success(resp.msg, 'Success');
          this.router.navigate(['/layout/home']);
        }
        else{
          this.toastr.error(resp.msg, 'Error');
        }
      })
    

  }
}
