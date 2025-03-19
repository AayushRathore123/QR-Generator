import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DisableCutCopyPasteDirective } from '../../../shared/directives/disablecopypaste/disable-cut-copy-paste.directive';
import { EncryptDecryptService } from '../../../shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { AuthService } from '../../../shared/services/auth/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, DisableCutCopyPasteDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm?: any;
  submitted = false;
  showpassword = false;
  showconfirmpassword = false;
  gender: any = [{ id: 1, text: 'Select Gender' }, { id: 2, text: "Female" }, { id: 3, text: "Male" }, { id: 4, text: "Other" }]
  tooltipmsg = "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character."
  constructor(private fb: FormBuilder, private router: Router, private encryptdecryptservice: EncryptDecryptService, private _authService: AuthService) { };

  // constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
      dob: [''],
      gender: [''],
      confirmpassword: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8),
      Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
      ]]
    });
  }

  ngAfterViewInit() {
    // Select all elements with the tooltip attribute
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    // Initialize Bootstrap tooltips
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
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
    console.log('loginform', this.registerForm)
    if (this.registerForm.valid && this.registerForm.controls['confirmpassword'].value != this.registerForm.controls['password'].value) {
      // this._toastr.error("Passswords dont match", 'ERROR');
      this.registerForm.patchValue({ confirmpassword: '' });
      return;
    }
    if (this.registerForm.valid && this.registerForm.controls['confirmpassword'].value == this.registerForm.controls['password'].value) {
      let jsonData = {
        'username': this.registerForm.controls['username'].value.trim().toLowerCase(),
        'firstname': this.registerForm.controls['firstname'].value.trim().toLowerCase(),
        'lastname':this.registerForm.controls['lastname'].value.trim().toLowerCase(),
        'dob': this.registerForm.controls['dob'].value,
        'gender': this.registerForm.controls['gender'].value,
        'password': this.encryptdecryptservice.encrypt(this.registerForm.controls['password'].value)
      }
      this._authService.register(jsonData).subscribe(resp => {
        if (resp.status == "Success") {

        }
        else {

        }
      })
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
