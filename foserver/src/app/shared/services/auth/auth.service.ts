import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  url = "http://localhost:5011/login";
  private userSubject = new BehaviorSubject<any>(null); 
  user = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  setUser(user: any) {
    this.userSubject.next(user); 
    localStorage.setItem("user", JSON.stringify(user));
  }

  getUser(): Observable<any> {
    return this.user; 
  }

  getStoredUser() {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  register(jsonData: any): Observable<any> {
    return this.http.post<any>(this.url, jsonData).pipe(map((data) => {
      return data;
    }));
  }

  login(jsonData:any): Observable<any>{
    return this.http.post<any>(this.url,jsonData).pipe(map((data) => {
      localStorage.setItem('Token', 'this.token');
      return data;
    }));
  }

  isAuthenticatedUser():boolean{
    if(localStorage.getItem("Token")===null){
      return false;
    }
    else{
      return true;
    }
  }

  logout(){
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
    this.userSubject.next(null);
  }
}
