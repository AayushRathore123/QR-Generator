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
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private encryptDecryptService: EncryptDecryptService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const jsonData = {
      user_name: this.loginForm.value.username.trim().toLowerCase(),
      password: this.encryptDecryptService.encrypt(this.loginForm.value.password),
    };

    // let jsonData = {
    //   user_name: 'test@gmail.com',
    //   password: 'test',
    // };

    this.authService.login(jsonData).subscribe(
      (resp) => {
        if (resp && resp.errCode === 0) {
          this.toastr.success(resp.msg, 'Success');
          this.authService.setUser(resp.data_rec);
          this.router.navigate(['/layout/home']);
        } else {
          this.toastr.error(resp.msg, 'Error');
        }
      },
      (error) => {
        this.toastr.error('Something went wrong. Please try again.', 'Error');
      }
    );

    console.log("hi",this.authService.getStoredUser() );
  }
}
