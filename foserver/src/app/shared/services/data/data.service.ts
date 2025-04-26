import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  private saveURL = environment.apiUrl+'qr_code/create';
  private getDataURL =environment.apiUrl+'qr_code/get_all';
  private updateDataURL =environment.apiUrl+'qr_code/update';
  private deleteDataURL =environment.apiUrl+'qr_code/remove';

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
  
}
