import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports:[CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  // constructor(public _auth: AuthService, private _toastr: ToastrService) { }
  ngOnInit(): void {
  }
  logout(): void {
    // this._auth.logout();
    // this._toastr.success('Logged out successfully', "SUCCESS")
  }
}
