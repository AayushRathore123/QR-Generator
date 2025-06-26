import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  //QR generator
  private saveURL = environment.apiUrl+'qr_code/create';
  private getDataURL =environment.apiUrl+'qr_code/get_all';
  private updateDataURL =environment.apiUrl+'qr_code/update';
  private deleteDataURL =environment.apiUrl+'qr_code/remove';

  //URL shortner
  private urlShortnerURL =environment.apiUrl+'url_shortener/create';

  constructor(private http: HttpClient) {}

  saveQrCode(data: any): Observable<any> {
    return this.http.post(this.saveURL, data);
  }

  getDashboardData(user_id:any):Observable<any>{
    const url = `${this.getDataURL}?user_id=${user_id}`;  
    return this.http.get(url);
  }

  updateQR(data: any) {
    return this.http.post(this.updateDataURL, data);
  }
  
  deleteQR(data: any) {
    return this.http.post(this.deleteDataURL, data);
  }

  urlShortner(url:any){
    return this.http.post(this.urlShortnerURL, url);
  }
  
}
