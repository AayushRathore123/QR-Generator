import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactusService {

  constructor(private http:HttpClient) { }
  private contactusURL = environment.apiUrl+'contact_us';

  contactus(data:any){
    return this.http.post(this.contactusURL,data);
  }
}
