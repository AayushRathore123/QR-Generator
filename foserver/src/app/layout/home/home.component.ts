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
@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, ReactiveFormsModule, QRCodeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  isLinkQr: boolean = false;
  isWifiQr: boolean = false;
  qrCodeData: string | null = null;
  wifiForm: FormGroup;
  linkForm: FormGroup;
  authTypes = ['WPA/WPA2', 'WEP', 'None'];
  wifiString: string | null = null;
  linkString: string | null = null;
  qrCodeDownloadLink: SafeUrl | null = null;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.linkForm = this.fb.group({
      url: ['', [Validators.required]],
    });

    this.wifiForm = this.fb.group({
      ssid: ['', Validators.required],
      password: ['', Validators.required],
      authType: ['WPA/WPA2', Validators.required],
    });
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
    this.wifiString = null;
    this.linkString = null;
    this.qrCodeDownloadLink = null;
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

  onChangeURL(url: SafeUrl) {
    if (url && url.toString().startsWith('data:image/png')) {
      this.qrCodeDownloadLink = this.sanitizer.bypassSecurityTrustUrl(url as string);
    } else {
      console.error('Invalid QR Code URL:', url);
    }
  }

  downloadQR(parent:any) {
    const parentElement = parent.el.nativeElement.querySelector("img").src;
    let blobData = this.convertBase64ToBlob(parentElement);
    console.log(blobData)
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
    
  }
}
