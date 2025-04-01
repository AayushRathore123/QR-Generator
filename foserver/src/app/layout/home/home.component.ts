import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, ReactiveFormsModule, QRCodeComponent],
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

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private authService:AuthService, private toastr: ToastrService
  , private router:Router, private data: DataService, private encryptDecrypt:EncryptDecryptService) {
    this.linkForm = this.fb.group({
      url: ['', [Validators.required]],
    });

    this.wifiForm = this.fb.group({
      ssid: ['', Validators.required],
      password: ['', Validators.required],
      authType: ['WPA/WPA2', Validators.required],
    });
  }

  toggleQrType(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.isLinkQr = checked;
    this.isWifiQr = !checked;
    this.resetQrCodes();
}

  onClickLinkQr() {
    this.isLinkQr = true;
    this.isWifiQr = false;
    this.resetQrCodes();
  }

  onClickWifiQr() {
    this.isLinkQr = false;
    this.isWifiQr = true;
    this.resetQrCodes();
  }

  resetQrCodes() {
    this.wifiString = '';
    this.linkString = '';
    this.qrCodeDownloadLink = '';
  }

  generateWifiQR() {
    if (this.wifiForm.valid) {
      const { ssid, authType, password } = this.wifiForm.value;
      this.wifiString = `WIFI:S:${ssid};T:${authType};P:${password};;`;
    }
  }

  generateLinkQR() {
    if (this.linkForm.valid) {
      this.linkString = this.linkForm.value.url;
    }
  }

  downloadQR(parent:any) {
    const parentElement = parent.el.nativeElement.querySelector("img").src;
    let blobData = this.convertBase64ToBlob(parentElement);
    const blob = new Blob([blobData], { type: "image/png" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Qrcode';
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
      let data;
      if(this.isWifiQr){
        data = {
          'ssid': this.encryptDecrypt.encrypt(this.wifiForm.value.ssid),
          'password': this.encryptDecrypt.encrypt(this.wifiForm.value.password),
          'authType':this.encryptDecrypt.encrypt(this.wifiForm.value.authType)
        }
      }
      else{
        data={
          'url': this.encryptDecrypt.encrypt(this.linkForm.value.url)
        }
      }
      let jsonData ={
        'type': this.isWifiQr? 'WIFI':'LINK',
        'data': JSON.stringify(data),
        'created_at': new Date()
      }
      this.data.saveQrCode(jsonData).subscribe(
        (response) => {
          this.toastr.success('QR Code saved successfully!', 'Success');
        },
        (error) => {
          this.toastr.error('Failed to save QR Code. Try again!', 'Error');
        }
      );
      this.router.navigate(['/layout/home']);
    }
    else{
      this.toastr.warning('Please log in to save your QR Code!', 'Warning');
    }
  }
}
