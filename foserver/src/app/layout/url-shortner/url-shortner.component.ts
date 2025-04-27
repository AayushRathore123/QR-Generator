import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data/data.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-url-shortner',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './url-shortner.component.html',
  styleUrl: './url-shortner.component.scss'
})
export class UrlShortnerComponent {
  urlForm: FormGroup;
  shortUrl: string = '';
  isLoader: boolean = false;

  constructor(private fb: FormBuilder,private _dataService:DataService, private _toastrService: ToastrService) {
    this.urlForm = this.fb.group({
      longUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  generateShortUrl() {
    if (this.urlForm.invalid) {
      this.urlForm.markAllAsTouched();
      return;
    }
    const longUrl = this.urlForm.value.longUrl;
    let jsondata={
      url:longUrl
    }
    this.isLoader = true;
    this._dataService.urlShortner(jsondata).subscribe(
      (response:any)=>{
        this.isLoader = false;
        if(response.errCode==0){
          this.shortUrl= response.datarec.short_url;
        }
        else{
          this._toastrService.error(response.msg,"Error")  
        }
      },
      (error)=>{
        console.error('Error shortening URL:', error);
      }
    )
  }

  copyToClipboard(){
  }
}
