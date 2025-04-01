import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent{

  isLoggedIn=false;
  private authSubscription!:Subscription;

  constructor(public _auth: AuthService) { }
  ngOnInit() {
    this.authSubscription = this._auth.user.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    this.user = this._auth.getStoredUser();

  }

  user: any;

  logout(): void {
    this._auth.logout();
  }

  OnDestroy(){
    this.authSubscription.unsubscribe();
  }


}
