import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EncryptDecryptService } from '../../../shared/services/encrypt-decrypt/encrypt-decrypt.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  isLoader: boolean = false;
  maxDate:any;
  showDeleteModal = false;
  showChangePasswordSection = false;
  showcurrpass:boolean=false;
  shownewpass:boolean=false;
  changePasswordForm!: FormGroup;
  editUserForm!: FormGroup;
  constructor(private fb: FormBuilder, private _authService :AuthService, private _toastrService:ToastrService
    ,private router:Router, private encryptdecryptservice:EncryptDecryptService
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
      ]]
    });
    this.editUserForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      firstname:['',[Validators.required, Validators.maxLength(50)]],
      lastname:[''],
      gender:[''],
      dob:['']
    });

    this.maxDate = new Date().toISOString().split('T')[0];
    this.getUserData();
  }

  getUserData() {
    this.isLoader=true
    const user_id = this._authService.getUserId();
    this._authService.getUserData(user_id).subscribe(
      (resp:any) => {
        this.isLoader=false;
        if (resp.errCode === 0) {
          this.editUserForm.patchValue({
            username: this._authService.getUserName(),
            firstname: resp.datarec.first_name,
            lastname: resp.datarec.last_name,
            gender: resp.datarec.gender,
            dob: resp.datarec.dob
          });
        }
      },
      (error) => {
        this.isLoader=false;
        console.error('Error fetching user data:', error);
      }
    );
  }

  updateUserDetails(){
    const trimmedValues = {
      firstname: this.editUserForm.value.firstname?.trim(),
      lastname: this.editUserForm.value.lastname?.trim(),
      dob: this.editUserForm.value.dob,
      gender: this.editUserForm.value.gender,
    };
    this.editUserForm.patchValue(trimmedValues);
    if (this.editUserForm.invalid) {
      this.editUserForm.markAllAsTouched();
      this._toastrService.error("Please fill all required fields properly.", 'Error');
      return;
    }
    const user_id = this._authService.getUserId();
    let jsonData ={
      user_id : user_id,
      first_name : this.editUserForm.controls['firstname'].value,
      last_name : this.editUserForm.controls['lastname'].value,
      dob : this.editUserForm.controls['dob'].value,
      gender: this.editUserForm.controls['gender'].value
    }
    this._authService.updatedUserData(jsonData).subscribe(
      (resp:any)=>{
        if(resp.errCode==0){
          this._toastrService.success(resp.msg, 'Success');
          this.router.navigate(['/layout/home']);
        }
        else{
          this._toastrService.error(resp.msg, 'Error');
        }
      },
      (error)=>{
        console.error('Error updating user data:', error);
      }
    )
  }
  
  onDeleteModal(evt:any) {
    evt.preventDefault();
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    const user_id= this._authService.getUserId();
    this._authService.deleteUser(user_id).subscribe(
      (res)=>{

      },
      (err)=>{

      }
    )
    this.closeDeleteModal();
  }

  goToChangePassword() {
    this.showChangePasswordSection = true;
  }

  goBackToProfile() {
    this.showChangePasswordSection = false;
  }

  changePassword(){
    const user_id= this._authService.getUserId();
    const trimmedValues = {
      currentPassword: this.changePasswordForm.value.currentPassword?.trim(),
      confirmPassword: this.changePasswordForm.value.confirmPassword?.trim(),
      newPassword: this.changePasswordForm.value.newPassword.trim()
    };
    this.changePasswordForm.patchValue(trimmedValues);
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      this._toastrService.error("Please fill all required fields properly.", 'Error');
      return;
    }
    if(this.changePasswordForm.value.newPassword != this.changePasswordForm.value.confirmPassword){
      this._toastrService.error("Passwords don't match.", 'Error');
      return;
    }
    let jsondata={
      "old_password": this.encryptdecryptservice.encrypt(this.changePasswordForm.value.currentPassword),
      "new_password": this.encryptdecryptservice.encrypt(this.changePasswordForm.value.newPassword),
      "user_id": user_id
    }
    this._authService.changeUserPassword(jsondata).subscribe(
      (resp:any)=>{
        if(resp && resp.errCode===0){
          this._toastrService.success(resp.msg,'Success');
          this.router.navigate(['/layout/home']);
        }
        else{
          this._toastrService.error(resp.msg,'Error');
        }
      }
    )
  }

  seepassword(flag: boolean, input: string) {
    if (input == 'currpass' && this.changePasswordForm.controls['currentPassword'].value != "") {
      this.showcurrpass = true;
      if (flag == true)
        this.showcurrpass = false;
      else
        setTimeout(() => {
          this.showcurrpass = false;
        }, 3000);
    }
    else if (input == 'newpass' && this.changePasswordForm.controls['newPassword'].value != "") {
      this.shownewpass = true;
      if (flag == true)
        this.shownewpass = false;
      else
        setTimeout(() => {
          this.shownewpass = false;
        }, 3000);
    }

  }

  logout(){
    this._authService.logout();
    this._toastrService.success('Logged out successfully!','Success')
    this.router.navigate(['/layout/home']);  
  }
}
