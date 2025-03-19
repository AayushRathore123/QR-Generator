import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  restrictAbout:string[] = ["id", "create_datetime", "lastchange_datetime", "this_user_details2user", "status"];
  userMap: Map<string, any> = new Map();

  constructor(public _auth: AuthService) { }
  ngOnInit(): void {
    this._auth.getUser().subscribe(data => {
      if (data) {
        this.userMap = new Map(Object.entries(data.data_rec));
      }
    })
  }

  user: any;

  logout(): void {
    // this._auth.logout();
    // this._toastr.success('Logged out successfully', "SUCCESS")
  }


}
