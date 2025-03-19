import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DisableCutCopyPasteDirective } from '../../../shared/directives/disablecopypaste/disable-cut-copy-paste.directive';
import { EncryptDecryptService } from '../../../shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { AuthService } from '../../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,ReactiveFormsModule,DisableCutCopyPasteDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm?: any;
  submitted = false;
  showpassword = false;

  // constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private _toastr: ToastrService) { }
  constructor(private fb: FormBuilder,private router: Router, private encryptdecryptservice: EncryptDecryptService, private _authService: AuthService){}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username:['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['']
    });
  }

  seepassword(flag:boolean) {
    if( this.loginForm.controls['password'].value!=""){
      this.showpassword = true;
      if (flag == true)
        this.showpassword = false;
      else
        setTimeout(() => {
          this.showpassword = false;
        }, 3000);
    }
  }

  onSubmit(): void {
    console.log('loginform', this.loginForm)
    if (this.loginForm.valid) {
      // let jsonData = {
      //   'user_name': this.loginForm.controls['username'].value.trim().toLowerCase(),
      //   'password': this.encryptdecryptservice.encrypt(this.loginForm.controls['password'].value)
      // }

      let jsonData = {
        "user_name": "test@gmail.com",
          "password":"test"
      }

      this._authService.login(jsonData).subscribe(resp=>{
        if(resp.status=="Success"){

        }
        else{

        }
      })
      // this.authService.login(username, password).subscribe(resp => {
      //   if (resp.status == 'Success') {
      //     this._toastr.success(resp.message, 'SUCCESS')

      //     // alert(resp.message);
      //     console.log("Login successful");
      //     this.router.navigate(['/products']);
      //   } else {
      //     this._toastr.error(resp.message, 'ERROR')
      //     // alert(resp.message);
      //     console.log("Login failed");
      //   }
      // });
    }
    this.submitted = true;

  }
}
