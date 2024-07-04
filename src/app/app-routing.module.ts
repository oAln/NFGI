import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberComponent } from './member/member.component';
import { CollectionComponent } from './collection/collection.component';
import { PasswordComponent } from './user/change-password/password.component';
import { CreateUserComponent } from './user/create-user/create-user.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'members',
    component: MemberComponent,
  },
  {
    path: 'collections',
    component: CollectionComponent,
  },
  {
    path: 'change-password',
    component: PasswordComponent,
  },
  {
    path: 'create-user',
    component: CreateUserComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
