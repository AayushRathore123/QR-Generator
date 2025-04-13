import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environment/environment";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null); 
  user = this.userSubject.asObservable();
  private loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticatedUser());
  isLoggedIn$ = this.loggedInSubject.asObservable();


  constructor(private http: HttpClient) {}

  register(jsonData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'register', jsonData).pipe(map((data) => {
      return data;
    }));
  }

  login(jsonData:any): Observable<any>{
    return this.http.post<any>(this.apiUrl+'login',jsonData).pipe(map((data) => {
      if(data.errCode==0){
        localStorage.setItem('Token', data.access_token);
        const payloadBase64 = data.access_token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const subData = JSON.parse(decodedPayload.sub);
        const userId = subData.user_id;
        const exp = decodedPayload.exp;
        localStorage.setItem('UserId',userId);
        localStorage.setItem('expiry', exp);
        this.userSubject.next(data.data_rec); 
        this.loggedInSubject.next(true);
      }
      return data;
    }));
  }

  isAuthenticatedUser():boolean{
    const token = localStorage.getItem("Token");
    const expiry = Number(localStorage.getItem("expiry"));
    const currentTime = Math.floor(Date.now() / 1000);
    if (!token || currentTime > expiry) {
      return false;
    }
    return true;
  }

  logout(){
    this.loggedInSubject.next(false);
    localStorage.removeItem("Token");
    localStorage.removeItem("UserId");
    localStorage.removeItem("expiry");
    this.userSubject.next(null);
  }

  getUserId(){
    return localStorage.getItem("UserId");
  }

  getToken(){
    return localStorage.getItem("Token");
  }
}
