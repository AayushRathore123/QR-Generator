import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./layout/auth/login/login.component";
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { RegisterComponent } from "./layout/auth/register/register.component";

@Component({
  selector: 'app-root',
  imports: [LoginComponent, NavbarComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'foserver';
}
