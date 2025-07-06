import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DisableCutCopyPasteDirective } from '../../../shared/directives/disablecopypaste/disable-cut-copy-paste.directive';
import { EncryptDecryptService } from '../../../shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, DisableCutCopyPasteDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm?: any;
  showpassword = false;
  showconfirmpassword = false;
  gender: any = []
  maxDate:any;
  tooltipmsg = "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character."
  constructor(private fb: FormBuilder, 
    private router: Router, 
    private encryptdecryptservice: EncryptDecryptService, 
    private _authService: AuthService,
    private toastr: ToastrService) { };

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.maxLength(50)]],
      dob: [''],
      gender: [''],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
      ]],
      confirmpassword:['',[Validators.required]]
  })
  this.gender = [ { id: 1, text: "Female" }, { id: 2, text: "Male" }, { id: 3, text: "Other" }]
  this.maxDate = new Date().toISOString().split('T')[0];
}

  seepassword(flag: boolean, input: string) {
    if (input == 'password' && this.registerForm.controls['password'].value != "") {
      this.showpassword = true;
      if (flag == true)
        this.showpassword = false;
      else
        setTimeout(() => {
          this.showpassword = false;
        }, 3000);
    }
    else if (input == 'confirmpassword' && this.registerForm.controls['confirmpassword'].value != "") {
      this.showconfirmpassword = true;
      if (flag == true)
        this.showconfirmpassword = false;
      else
        setTimeout(() => {
          this.showconfirmpassword = false;
        }, 3000);
    }

  }

  onSubmit(): void {
    const trimmedValues = {
      username: this.registerForm.value.username?.trim(),
      firstname: this.registerForm.value.firstname?.trim(),
      lastname: this.registerForm.value.lastname?.trim(),
      dob: this.registerForm.value.dob,
      gender: this.registerForm.value.gender,
      password: this.registerForm.value.password?.trim(),
    };
    this.registerForm.patchValue(trimmedValues);
  
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.error("Please fill all required fields properly.", 'Error');
      return;
    }
    if (this.registerForm.valid && this.registerForm.controls['confirmpassword'].value != this.registerForm.controls['password'].value) {
      this.toastr.error("The passwords you entered do not match.", 'Password Mismatch');
      return;
    }
    if (this.registerForm.valid && this.registerForm.controls['confirmpassword'].value == this.registerForm.controls['password'].value) {
      let jsonData = {
        'user_name': this.registerForm.controls['username'].value.toLowerCase(),
        'first_name': this.registerForm.controls['firstname'].value,
        'last_name':this.registerForm.controls['lastname'].value || null,
        'dob': this.registerForm.controls['dob'].value || null,
        'gender': this.registerForm.controls['gender'].value || null,
        'password': this.encryptdecryptservice.encrypt(this.registerForm.controls['password'].value)
      }
      this._authService.register(jsonData).subscribe(resp => {
        if (resp.errCode === 0) {
          this.toastr.success(resp.msg, 'Success');
          // this.toastr.success('Please log in to continue.', 'Success');
          // this.router.navigate(['/login']);
          this.router.navigate(['/layout/home']);
        }
        else {
          this.toastr.error(resp.msg, 'Error');
        }
      })
    }
  }

}
