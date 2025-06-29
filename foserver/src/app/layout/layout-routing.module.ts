import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from '../shared/guards/auth.guard';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { UrlShortnerComponent } from './url-shortner/url-shortner.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'url-shortner', component: UrlShortnerComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate:[authGuard] },
      { path: 'profile', component: UserProfileComponent, canActivate:[authGuard] },
      { path: 'contactus', component: ContactUsComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
