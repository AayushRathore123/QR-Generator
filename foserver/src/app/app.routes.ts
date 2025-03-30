import { Routes } from '@angular/router';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'layout', pathMatch: 'full' },
  { path: 'layout', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) },
  { path: 'login', component: LoginComponent}, 
  { path: 'register', component: RegisterComponent }, 
  { path: '**', redirectTo: 'layout' } 
];
