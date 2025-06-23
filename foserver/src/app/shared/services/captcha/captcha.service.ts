import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {
  private getCaptchaURL = environment.apiUrl+'captcha_code/get';
  private validateCaptchaURL = environment.apiUrl+'captcha_code/validate'

  constructor(private http:HttpClient) { }

  getCaptcha():Observable<any>{
    return this.http.get(this.getCaptchaURL);
  }

  validateCaptcha(jsonData:any):Observable<any>{
    return this.http.post(this.validateCaptchaURL,jsonData);
  }

}
