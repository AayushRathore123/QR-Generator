import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-qr-name-modal',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './qr-name-modal.component.html',
  styleUrl: './qr-name-modal.component.scss'
})
export class QrNameModalComponent {
  qrName = '';
  qrDescription='';
  nameForm!: FormGroup;
  @Output() nameDescSubmitted = new EventEmitter<{ name: string; description: string }>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.nameForm = this.fb.group({
      qrName: ['', [Validators.required, Validators.maxLength(50)]],
      qrDescription: ['', [Validators.maxLength(50)]]
    });
  }

  submitNameDesc(): void {
    const trimmedName = this.nameForm.value.qrName.trim();
    const trimmedDesc = this.nameForm.value.qrDescription.trim();
  
    this.nameForm.patchValue({
      qrName: trimmedName,
      qrDescription: trimmedDesc
    });
  
    if (this.nameForm.valid) {
      this.nameDescSubmitted.emit({
        name: trimmedName,
        description: trimmedDesc
      });
    } else {
      this.nameForm.markAllAsTouched();
    }
  }
  

  cancel() {
    this.cancelled.emit();
  }
}
