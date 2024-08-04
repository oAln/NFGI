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
  currentUser = false;
  userMenu = false;
  userName: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(user => {
      if (localStorage['token']) {
        this.userName = JSON.parse(localStorage['token']).name;
      } else {
        this.userName = '';
      }
      this.currentUser = !(typeof user.token === 'undefined')
    });

    document.addEventListener('click', (event) => {
      this.userMenu = false;
    }, true);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  showUserMenu() {
    this.userMenu = !this.userMenu;
  }

  createUser() {
    this.router.navigate(['/create-user']);
  }
}
