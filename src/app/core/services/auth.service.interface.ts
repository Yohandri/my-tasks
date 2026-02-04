import { Observable } from 'rxjs';

import { User, LoginRequest, LoginResponse } from '../models/user.model';

/**
 * Auth Service Interface
 * Defines the contract for authentication operations
 * @interface AuthServiceInterface
 */
export interface AuthServiceInterface {
  /**
   * Login user with email
   * @param {LoginRequest} credentials - User credentials
   * @returns {Observable<LoginResponse>} Login response with token
   */
  login(credentials: LoginRequest): Observable<LoginResponse>;

  /**
   * Logout current user
   * @returns {void}
   */
  logout(): void;

  /**
   * Get current authenticated user
   * @returns {User | null} Current user or null
   */
  getCurrentUser(): User | null;

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated(): boolean;

  /**
   * Get JWT token
   * @returns {string | null} JWT token or null
   */
  getToken(): string | null;
}
