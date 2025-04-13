import { CommonModule } from '@angular/common';
import { Component,ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DataService } from '../../shared/services/data/data.service';
import { EncryptDecryptService } from '../../shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { QrNameModalComponent } from '../../shared/components/qr-name-modal/qr-name-modal.component';
@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, ReactiveFormsModule, QRCodeComponent,QrNameModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  isLinkQr: boolean = false;
  isWifiQr: boolean = true;
  qrCodeData: string | null = null;
  wifiForm: FormGroup;
  linkForm: FormGroup;
  authTypes = ['WPA/WPA2', 'WEP', 'None'];
  wifiString: string = '';
  linkString: string= '';
  qrCodeDownloadLink: SafeUrl = '';
  showNamePrompt = false;
  showPassword = false;
  
  @ViewChild('qrCanvas') qrCanvas!:ElementRef;
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private authService:AuthService, private toastr: ToastrService
  , private router:Router, private data: DataService, private encryptDecrypt:EncryptDecryptService) {
    this.linkForm = this.fb.group({
      url: ['', [Validators.required]],
    });

    this.wifiForm = this.fb.group({
      ssid: ['', Validators.required],
      password: [''],
      authType: ['WPA/WPA2', Validators.required],
    });
  }

  toggleQrType(event:any) {
    const checked = event.target.checked;
    this.isLinkQr = checked;
    this.isWifiQr = !checked;
    this.resetQrCodesAndForms();
    
}

  onClickLinkQr() {
    this.isLinkQr = true;
    this.isWifiQr = false;
    this.resetQrCodesAndForms();
  }

  onClickWifiQr() {
    this.isLinkQr = false;
    this.isWifiQr = true;
    this.resetQrCodesAndForms();
  }

  resetQrCodesAndForms() {
    this.wifiString = '';
    this.linkString = '';
    this.qrCodeDownloadLink = '';
    this.wifiForm.reset({
      ssid: '',
      password: '',
      authType: 'WPA/WPA2' 
    });
  
    this.linkForm.reset({
      url: ''
    });
  }

  generateWifiQR() {
    const passwordControl = this.wifiForm.get('password');
    if (this.wifiForm.value.authType !== 'None') {
      passwordControl?.setValidators(Validators.required);
    } else {
      passwordControl?.clearValidators();
      passwordControl?.setValue('');
    }
  
    passwordControl?.updateValueAndValidity();
  this.wifiForm.patchValue({
    ssid: this.wifiForm.value.ssid.trim(),
    password: this.wifiForm.value.password?.trim(),
    authType: this.wifiForm.value.authType.trim(),
  });
    this.wifiForm.markAllAsTouched();

    if (this.wifiForm.valid) {
      const { ssid, authType, password } = this.wifiForm.value;
      if (authType === 'None') {
      this.wifiString = `WIFI:S:${ssid};T:nopass;;`;
    } else {
      this.wifiString = `WIFI:S:${ssid};T:${authType};P:${password};;`;
    }
    }
  }

  togglePassword(flag: boolean): void {
    this.showPassword = true;
    if (flag === true) {
      this.showPassword = false;
    } else {
      setTimeout(() => {
        this.showPassword = false;
      }, 3000);
    }
  }

  generateLinkQR() {
    const trimmedUrl = this.linkForm.value.url.trim();
    this.linkForm.get('url')?.setValue(trimmedUrl);
    this.wifiForm.markAllAsTouched();
    if (this.linkForm.valid) {
      this.linkString = trimmedUrl;
    }
  }

  downloadQR(qrCanvas: any) {
      const canvas: HTMLCanvasElement = qrCanvas.qrcElement.nativeElement.querySelector('canvas');
      const dataUrl = canvas.toDataURL('image/png');
      const blobData = this.convertBase64ToBlob(dataUrl);
      const blob = new Blob([blobData], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'QRCode.png';
      link.click();
  }

  private convertBase64ToBlob(Base64Image: any) {
    const parts = Base64Image.split(';base64,');
    const imageType = parts[0].split(':')[1];
    const decodedData = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: imageType });
  }

  saveQR(){
    if(this.authService.isAuthenticatedUser()){
      this.showNamePrompt = true;
    }
    else{
      this.toastr.warning('Please log in to save your QR Code!', 'Warning');
    }
  }

  onNameSubmit(event: { name: string; description: string }) {
    this.showNamePrompt = false;
    let data;
    if(this.isWifiQr){
      data = {
        'ssid': this.wifiForm.value.ssid,
        'password': this.encryptDecrypt.encrypt(this.wifiForm.value.password),
        'authType':this.wifiForm.value.authType
      }
    }
    else{
      data={
        'url': this.linkForm.value.url
      }
    }
    let jsonData ={
      'name':event.name,
      'description':event.description,
      'type': this.isWifiQr? 'wifi qr':'link qr',
      'data': JSON.stringify(data),
      'this_qr2user': this.authService.getUserId()
    }
    this.data.saveQrCode(jsonData).subscribe(
      (response) => {
        if(response && response.errCode === 0){
        this.toastr.success(response.msg, 'Success');
        }
      else{
        this.toastr.error(response.msg, 'Error');
      }
      }
    );
    this.router.navigate(['/layout/home']);  }
  
  onPromptCancel() {
    this.showNamePrompt = false;
  }
}
