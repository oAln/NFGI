import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './shared/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberComponent } from './member/member.component';
import { CollectionComponent } from './collection/collection.component';
import { PasswordComponent } from './user/change-password/password.component';
import { CreateUserComponent } from './user/create-user/create-user.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { fakeBackendProvider } from './helper/fake.backend';
import { AuthGuard } from './helper/auth.guard';
import { JwtInterceptor } from './helper/jwt.interceptor';
import { HttpRequestInterceptor } from './helper/http.interceptor';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { ReversePipe } from './shared/pipe/reverse.pipe';
import { PrintPageComponent } from './print-page/print-page.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    MemberComponent,
    CollectionComponent,
    PasswordComponent,
    CreateUserComponent,
    LoginComponent,
    ReportsComponent,
    ReversePipe,
    PrintPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    AngularMultiSelectModule
  ],
  providers: [ AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
