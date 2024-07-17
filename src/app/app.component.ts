import { Component } from '@angular/core';
import { User } from './model/user';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NFGI';
  currentUser= false;
  userMenu = false;

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) {
      this.authenticationService.currentUser.subscribe(data => {
        this.currentUser = !(typeof data.username === 'undefined')
      });
  }

  logout() {
    this.authenticationService.logout();
        this.router.navigate(['/login']);
  }

  showUserMenu() {
    this.userMenu = !this.userMenu;
  }
}
