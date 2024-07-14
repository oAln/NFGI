import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './shared/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberComponent } from './member/member.component';
import { CollectionComponent } from './collection/collection.component';
import { PasswordComponent } from './user/change-password/password.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import {HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { fakeBackendProvider } from './helper/fake.backend';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    MemberComponent,
    CollectionComponent,
    PasswordComponent,
    CreateUserComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [fakeBackendProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
