import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available

        const token = {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjEzMDA2MTUsImV4cCI6MTcyMTMwNDIxNX0.llCfryqcToiB_cjTGlJ_xtjMHnDZV_GRKE2YMIZy43Y"
          }
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token?.access_token}`,
                }
            });
        }

        return next.handle(request);
    }
}