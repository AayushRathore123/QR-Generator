import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { DataService } from '../../shared/services/data/data.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { EncryptDecryptService } from '../../shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, QRCodeComponent,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  qrcodes: any[] = [];
  editIndex: number | null = null;
editedName: string = '';
editedDescription: string = '';
deleteTarget: any = null;

constructor(
  private _getDataService: DataService,
  private _authService: AuthService,
  private _encryptDecryptService:EncryptDecryptService
) {}

ngOnInit() {
  this.getQrData();
}

editRow(index: number) {
  this.editIndex = index;
  this.editedName = this.qrcodes[index].name;
  this.editedDescription = this.qrcodes[index].description;
}

saveEdit(qr: any) {
  const payload = {
    qr_id: qr.id,
    name: this.editedName,
    description: this.editedDescription
  };

  this._getDataService.updateQR(payload).subscribe((response: any) => {
    if (response.errCode === 0) {
      qr.name = this.editedName;
      qr.description = this.editedDescription;
      this.editIndex = null;
    }
  });
}

cancelEdit() {
  this.editIndex = null;
}

confirmDelete(qr: any) {
  this.deleteTarget = qr;
}

deleteQR() {
  if (!this.deleteTarget) return;

  const payload = { qr_id: this.deleteTarget.id };

  this._getDataService.deleteQR(payload).subscribe((response: any) => {
    if (response.errCode === 0) {
      this.qrcodes = this.qrcodes.filter(q => q.id !== this.deleteTarget.id);
      this.deleteTarget = null;
    }
  });
}

  getQrData() {
    const jsonData = {
      user_id: this._authService.getUserId(),
    };
  
    this._getDataService.getDashboardData(jsonData).subscribe(
      (response) => {
        if (response.errCode === 0 && response.data?.length) {
          this.qrcodes = response.data.map((item: any) => {
            let parsedData: any = {};
                parsedData = JSON.parse(item.data);
              if (item.type.includes('wifi')) {
                parsedData = {
                  ssid: this._encryptDecryptService.decrypt(parsedData.ssid),
                  password: this._encryptDecryptService.decrypt(parsedData.password),
                  authType: this._encryptDecryptService.decrypt(parsedData.authType),
                };
              } else if (item.type.includes('link')) {
                parsedData = {
                  url: this._encryptDecryptService.decrypt(parsedData.url),
                };
              }
            return {
              id: item.id,
              description: item.description,
              name: item.name,
              type: item.type.includes('wifi') ? 'wifi' : 'link',
              data: parsedData,
              saved_at: item.create_datetime,
            };
          });
        }
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
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
}
