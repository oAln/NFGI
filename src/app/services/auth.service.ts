import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { User } from "../model/user";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem("token") || "{}")
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    // post to fake back end, this url will be handled there...

    return this.http
      .post<any>(`${this.baseUrl}/auth/login`, { loginId:username, password })
      .pipe(
        map(user => {
          // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
          // user.token = window.btoa(username + ":" + password);
          localStorage.setItem("token", JSON.stringify(user));
          this.currentUserSubject.next({token:user.token});
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("token");
    const user = {
      id: undefined,
      username: undefined,
      password: undefined,
      firstName: undefined,
      lastName: undefined,
      token: undefined
     }
    this.currentUserSubject.next(user);
  }
}
