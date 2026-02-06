import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

import { AuthServiceInterface } from '../../core/services/auth.service.interface';
import { User, LoginRequest, LoginResponse } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

/**
 * Auth Service Implementation
 * Handles user authentication and token management
 * @class AuthService
 * @implements {AuthServiceInterface}
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthServiceInterface {
  /** API endpoint */
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  /** Current user subject for reactive updates */
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  /** Current user observable */
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  /**
   * Login user with email credentials
   * @param {LoginRequest} credentials - User email
   * @returns {Observable<LoginResponse>} Login response
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  /**
   * Logout current user and clear session
   * @returns {void}
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  /**
   * Get current authenticated user
   * @returns {User | null} Current user or null
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  /**
   * Get JWT token
   * @returns {string | null} JWT token or null
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Set authentication session
   * @param {LoginResponse} response - Login response
   * @private
   */
  private setSession(response: LoginResponse): void {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    this.currentUserSubject.next(response.data.user);
  }

  /**
   * Load user from local storage on initialization
   * @private
   */
  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }
}
