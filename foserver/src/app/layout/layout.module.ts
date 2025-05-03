import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './auth/user-profile/user-profile.component';
import { UrlShortnerComponent } from './url-shortner/url-shortner.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    LayoutComponent,
    HomeComponent,
    DashboardComponent,
    UserProfileComponent,
    UrlShortnerComponent,
    ContactUsComponent
  ]
})
export class LayoutModule { }
