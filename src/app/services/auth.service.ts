import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Only access localStorage if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  signup(userData: {
    email: string;
    password: string;
    name: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.token) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', response.token);
              localStorage.setItem('user', JSON.stringify(response.user));
            }
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: this.getHeaders(),
    });
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
}
