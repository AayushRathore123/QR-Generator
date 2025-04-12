import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-qr-name-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-name-modal.component.html',
  styleUrl: './qr-name-modal.component.scss'
})
export class QrNameModalComponent {
  qrName = '';
  qrDescription='';
  @Output() nameDescSubmitted = new EventEmitter<{ name: string; description: string }>();
  @Output() cancelled = new EventEmitter<void>();

  submitNameDesc() {
    if (this.qrName.trim() && this.qrDescription.trim()) {
      this.nameDescSubmitted.emit({ name: this.qrName, description: this.qrDescription });
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
