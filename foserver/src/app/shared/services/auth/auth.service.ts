import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  url = "";
  constructor(private http: HttpClient) {}

  register(jsonData: any): Observable<any> {
    return this.http.post<any>(this.url, jsonData).pipe(map((data) => {}));
  }
}
