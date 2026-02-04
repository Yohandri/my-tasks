/**
 * User interface representing an authenticated user
 * @interface User
 */
export interface User {
  /** Unique identifier */
  id: string;
  /** User email address */
  email: string;
  /** User creation timestamp */
  createdAt: Date;
}

/**
 * Login request payload
 * @interface LoginRequest
 */
export interface LoginRequest {
  /** User email address */
  email: string;
}

/**
 * Login response from API
 * @interface LoginResponse
 */
export interface LoginResponse {
  /** JWT access token */
  token: string;
  /** User information */
  user: User;
}
