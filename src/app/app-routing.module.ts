import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberComponent } from './member/member.component';
import { CollectionComponent } from './collection/collection.component';
import { PasswordComponent } from './user/change-password/password.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './helper/auth.guard';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'members',
    component: MemberComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'collections',
    component: CollectionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    component: PasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
