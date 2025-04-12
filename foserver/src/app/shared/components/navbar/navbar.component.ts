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
  private authSub!: Subscription;

  constructor(public _auth: AuthService) { }
  ngOnInit() {
    this.authSub = this._auth.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    // this.user = this._auth.getStoredUser();

  }

  user: any;

  logout(): void {
    this._auth.logout();
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }


}
