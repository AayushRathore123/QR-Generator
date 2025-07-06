import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DisableCutCopyPasteDirective } from '../../../shared/directives/disablecopypaste/disable-cut-copy-paste.directive';
import { EncryptDecryptService } from '../../../shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CaptchaService } from '../../../shared/services/captcha/captcha.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DisableCutCopyPasteDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  captcha_id = '';
  captcha = '';
  inputCaptcha = '';
  captchaLoading = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private encryptDecryptService: EncryptDecryptService,
    private authService: AuthService,
    private toastr: ToastrService,
    private captchaService : CaptchaService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      // captchaInput: ['', Validators.required]
    });
    this.getCaptcha();
  }

  togglePassword(flag:boolean): void {
    this.showPassword = true;
      if (flag == true)
        this.showPassword = false;
      else
        setTimeout(() => {
          this.showPassword = false;
        }, 3000);
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const jsonData = {
      user_name: this.loginForm.value.username.trim().toLowerCase(),
      password: this.encryptDecryptService.encrypt(this.loginForm.value.password),
    }

    this.authService.login(jsonData).subscribe(
      (resp => {
        if (resp && resp.errCode === 0) {
          this.toastr.success(resp.msg, 'Success');
          this.router.navigate(['/layout/home']);
        } else {
          this.toastr.error(resp.msg, 'Error');
        }
      })
    );
  }

  getCaptcha(){
    this.captchaLoading = true;
    this.captchaService.getCaptcha().subscribe(
      (resp:any)=>{
        if(resp && resp.errCode===0){
          this.captcha_id = resp.datarec.captcha_id;
          this.captcha = resp.datarec.captcha_img;
        }
        this.captchaLoading = false;
      },
      (error)=>{
        this.captchaLoading = false;
      }
    )
  }

  validateCaptchaAndLogin(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    let jsonData ={
      "input_captcha": this.loginForm.get('captchaInput')?.value,
      "captcha_id": this.captcha_id
    }
    this.captchaService.validateCaptcha(jsonData).subscribe(
      (resp:any)=>{
        if(resp && resp.errCode===0){
          this.onSubmit();
        }
        else{
          this.toastr.error(resp.msg, 'Error');
          this.inputCaptcha = '';
          this.loginForm.get('captchaInput')?.setValue('');
        }
      }
    )
  }

  loginWithGoogle() {
    window.location.href = this.authService.oauthLoginURL;
  }
}

