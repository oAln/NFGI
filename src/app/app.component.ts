import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/auth.service';
import { SubjectService } from './services/subject.service';

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
  printPage = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private subjectService: SubjectService
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

  ngOnInit(): void {
    this.subjectService.printData.subscribe(
      data => this.printPage = data
    );
  }
}
