import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available

        // const token = {
        //     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjE0OTQ2MjAsImV4cCI6MTcyMTQ5ODIyMH0.Pjgg2iNt98vcBvM-53JEP5pfatT56q-uMk_D4v3xFQY"
        //   }
        let user = JSON.parse(localStorage.getItem('token') || '{}');
        if (user?.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user?.token}`,
                }
            });
        }

        return next.handle(request);
    }
}