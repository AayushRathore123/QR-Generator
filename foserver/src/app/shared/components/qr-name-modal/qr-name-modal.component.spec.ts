import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrNameModalComponent } from './qr-name-modal.component';

describe('QrNameModalComponent', () => {
  let component: QrNameModalComponent;
  let fixture: ComponentFixture<QrNameModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrNameModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
