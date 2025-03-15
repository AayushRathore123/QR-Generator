import { Routes } from '@angular/router';
import { LoginComponent } from './layout/auth/login/login.component';
import { RegisterComponent } from './layout/auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'layout', pathMatch: 'full' },
  { path: 'layout', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) },
  { path: 'login', component: LoginComponent },  // ✅ Keep login outside layout
  { path: 'register', component: RegisterComponent },  // ✅ Keep register outside layout
  { path: '**', redirectTo: 'layout' } // Redirect unknown routes
];
