import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DisableCutCopyPasteDirective } from '../../../shared/directives/disablecopypaste/disable-cut-copy-paste.directive';

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
  constructor(private fb: FormBuilder,private router: Router){}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(5)]],
      password: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  seepassword(flag:boolean) {
    this.showpassword = true;
    if (flag == true)
      this.showpassword = false;
    else
      setTimeout(() => {
        this.showpassword = false;
      }, 3000);
  }

  onSubmit(): void {
    console.log('loginform', this.loginForm)
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username').value;
      const password = this.loginForm.get('password').value;
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
