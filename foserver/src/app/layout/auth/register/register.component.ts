import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  loginForm?: any;
  submitted = false;
  showpassword = false;
  showconfirmpassword = false;
gender:any =[{id:1,text:'Select Gender'},{id:2,text:"Female"},{id:3,text:"Male"},{id:4,text:"Other"}]
  constructor(private fb: FormBuilder, private router: Router) { }
  // constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(5)]],
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      dob: [''],
      gender: [''],
      confirmpassword: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  seepassword(flag:boolean, input:string) {
    if (input == 'password') {
      this.showpassword = true;
      if (flag == true)
        this.showpassword = false;
      else
        setTimeout(() => {
          this.showpassword = false;
        }, 3000);
    }
    else {
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
    console.log('loginform', this.loginForm)
    if (this.loginForm.valid && this.loginForm.get('confirmpassword').value != this.loginForm.get('password').value) {
      // this._toastr.error("Passswords dont match", 'ERROR');
      this.loginForm.patchValue({ confirmpassword: '' });
      return;
    }
    if (this.loginForm.valid && this.loginForm.get('confirmpassword').value == this.loginForm.get('password').value) {
      const username = this.loginForm.get('username').value;
      const password = this.loginForm.get('password').value;
      const fullname = this.loginForm.get('fullname').value;
      // this.authService.register(username, fullname, password).subscribe(resp => {
      //   if (resp.status == 'Success') {
      //     this._toastr.success(resp.message, 'SUCCESS')
      //     console.log("Registered successful");
      //     this.router.navigate(['/login']);
      //   } else {
      //     this._toastr.error(resp.message, 'ERROR')
      //     console.log("Login failed");
      //   }
      // });
    }

    this.submitted = true;

  }

}
