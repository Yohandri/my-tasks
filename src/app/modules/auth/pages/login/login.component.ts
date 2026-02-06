import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../../../infrastructure/services/auth.service';
import { LoginResponse } from '../../../../core/models/user.model';
import { CreateUserDialogComponent, CreateUserDialogData } from './create-user-dialog.component';

/**
 * Login Component
 * Handles user authentication with email-only login
 * @class LoginComponent
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Task Manager</mat-card-title>
          <mat-card-subtitle>Enter your email to continue</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="your@email.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage()" class="error-message">
              {{ errorMessage() }}
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="isLoading() || loginForm.invalid" class="full-width">
              <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              <span *ngIf="!isLoading()">Continue</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 24px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .error-message {
      color: #f44336;
      margin: 16px 0;
      padding: 12px;
      background: #ffebee;
      border-radius: 4px;
    }
    
    mat-card-title {
      text-align: center;
      margin-bottom: 8px;
    }
    
    mat-card-subtitle {
      text-align: center;
      margin-bottom: 24px;
    }
    
    button {
      margin-top: 16px;
    }
    
    mat-spinner {
      display: inline-block;
    }
  `]
})
export class LoginComponent {
  /** Login form */
  loginForm: FormGroup;

  /** Loading state signal */
  isLoading = signal(false);

  /** Error message signal */
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Handle form submission
   * @returns {void}
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { email } = this.loginForm.value;

    this.authService.login({ email }).subscribe({
      next: (res: LoginResponse) => {
        if (res.data.token) {
          this.router.navigate(['/tasks']);
        } else {
          this.showCreateUserDialog(email);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        /** Check if user doesn't exist - show dialog to create */
        if (error.status === 404) {
          this.showCreateUserDialog(email);
        } else {
          this.errorMessage.set(error.error?.message || 'Login failed. Please try again.');
        }
      }
    });
  }

  /**
   * Show dialog to confirm user creation
   * @param {string} email - User email
   * @private
   */
  private showCreateUserDialog(email: string): void {
    const dialogData: CreateUserDialogData = { email };
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '400px',
      data: dialogData
    });

    const create = true; // Flag to indicate user creation

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        /** Create user and login */
        this.authService.login({ email, create }).subscribe({
          next: () => {
            this.router.navigate(['/tasks']);
          },
          error: (createError) => {
            this.errorMessage.set(createError.error?.message || 'Failed to create user.');
          }
        });
      }
    });
  }
}

