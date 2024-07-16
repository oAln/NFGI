import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  private baseUrl = 'http://localhost:3000'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  get(url: string, params?: HttpParams, headers?: HttpHeaders) {
    const options = { params, headers };
    return this.http.get(`${this.baseUrl}/${url}`, options);
  }

  post(url: string, body: any, headers?: HttpHeaders) {
    const options = { headers };
    return this.http.post(`${this.baseUrl}/${url}`, body, options);
  }

  // Add methods for other HTTP verbs like put, patch, delete, etc.
}