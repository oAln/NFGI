import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { catchError, Observable, of, throwError } from 'rxjs';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

/** Inject With Credentials into the request */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authenticationService: AuthenticationService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpError: HttpErrorResponse) => {

        if (httpError.status === 401) {
          this.authenticationService.logout();
          this.router.navigate(['/login']);
          return throwError(() => httpError);
        }
        return of();
      }))
  }
}