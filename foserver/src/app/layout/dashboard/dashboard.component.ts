import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { DataService } from '../../shared/services/data/data.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { EncryptDecryptService } from '../../shared/services/encrypt-decrypt/encrypt-decrypt.service';
import { FormsModule } from '@angular/forms';
import { DeleteConfirmModalComponent } from '../../shared/components/delete-confirm-modal/delete-confirm-modal.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, QRCodeComponent,FormsModule,DeleteConfirmModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  qrcodes: any[] = [];
  editIndex: number | null = null;
editedName: string = '';
editedDescription: string = '';
deleteTarget: any = null;
showDeleteConfirm: boolean = false;
isLoader: boolean = false;

constructor(
  private _getDataService: DataService,
  private _authService: AuthService,
  private _encryptDecryptService:EncryptDecryptService,
  private _toastrService : ToastrService
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
      this._toastrService.success(response.msg,'Success')
      this.getQrData();
      this.editIndex = null;
    }
    else{
      this._toastrService.error(response.msg,'Error')
    }
  });
}

cancelEdit() {
  this.editIndex = null;
}

confirmDelete(qr: any) {
  this.deleteTarget = qr;
  this.showDeleteConfirm = true;
}

handleDeleteConfirm() {
  const payload = { qr_id: this.deleteTarget.id };
  this._getDataService.deleteQR(payload).subscribe((response: any) => {
    if (response.errCode === 0) {
      this._toastrService.success(response.msg,'Success')
      this.getQrData();    
    }
    else{
      this._toastrService.error(response.msg,'Error')
    }
    this.showDeleteConfirm = false;
    this.deleteTarget = null;
  });
}

handleDeleteCancel() {
  this.showDeleteConfirm = false;
  this.deleteTarget = null;
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
  this.isLoader=true
    const user_id= this._authService.getUserId();

    this._getDataService.getDashboardData(user_id).subscribe(
      (response) => {
      this.isLoader=false;
        if (response.errCode == 0 ) {
          this.qrcodes = response.data.map((item: any) => {
            let parsedData: any = {};
                parsedData = JSON.parse(item.data);
              if (item.type.includes('wifi')) {
                parsedData = {
                  ssid: parsedData.ssid,
                  password: this._encryptDecryptService.decrypt(parsedData.password),
                  authType: parsedData.authType,
                };
              } else if (item.type.includes('link')) {
                parsedData = {
                  url: parsedData.url,
                };
              }
            return {
              description: item.description,
              name: item.name,
              type: item.type.includes('wifi') ? 'wifi' : 'link',
              data: parsedData,
              saved_at: item.create_datetime,
            };
          });
        }
        else {
          this._toastrService.error(response.msg || 'Something went wrong', 'Error');
        }
      },
      (error) => {
        this.isLoader=false;
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
