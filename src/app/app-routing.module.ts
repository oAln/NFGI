import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { BookingsComponent } from './bookings/bookings.component';
// import { ConfigurationComponent } from './configuration/configuration.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    component: HomeComponent,
  },
  // {
  //   path: 'bookings',
  //   component: BookingsComponent,
  // },
  // {
  //   path: 'configuration',
  //   component: ConfigurationComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
