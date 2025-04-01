import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,QRCodeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  qrcodes = [
    {
      id: 1,
      name: "Home WiFi",
      type: "wifi",
      data: {
        ssid: "MyHomeNetwork",
        password: "securepass123",
        encryption: "WPA2"
      },
      saved_at: "2025-03-26T14:30:00Z"
    },
    {
      id: 2,
      name: "Work WiFi",
      type: "wifi",
      data: {
        ssid: "OfficeWiFi",
        password: "office@123",
        encryption: "WPA3"
      },
      saved_at: "2025-03-25T09:15:00Z"
    },
    {
      id: 3,
      name: "GitHub Profile",
      type: "link",
      data: {
        url: "https://github.com/usernamddddhhhhhhhhhhhhhhdcccccccccddddddddddddddddddde"
      },
      saved_at: "2025-03-24T18:45:00Z"
    },
    {
      id: 4,
      name: "Personal Blog",
      type: "link",
      data: {
        url: "https://myblog.com"
      },
      saved_at: "2025-03-23T12:10:00Z"
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  downloadQR(parent: any) {
    if (!parent) {
      console.error("Parent element is undefined");
      return;
    }

    const canvas = parent.querySelector("canvas");
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const base64Image = canvas.toDataURL("image/png");

    let blobData = this.convertBase64ToBlob(base64Image);
    const blob = new Blob([blobData], { type: "image/png" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'QRCode.png';
    link.click();
  }


  private convertBase64ToBlob(Base64Image: any) {
    // SPLIT INTO TWO PARTS
    const parts = Base64Image.split(';base64,');
    // HOLD THE CONTENT TYPE
    const imageType = parts[0].split(':')[1];
    // DECODE BASE64 STRING
    const decodedData = window.atob(parts[1]);
    // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
    const uInt8Array = new Uint8Array(decodedData.length);
    // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // RETURN BLOB IMAGE AFTER CONVERSION
    return new Blob([uInt8Array], { type: imageType });
  }
}
