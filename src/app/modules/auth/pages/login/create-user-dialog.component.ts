import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

/**
 * Dialog data interface
 */
export interface CreateUserDialogData {
  email: string;
}

/**
 * Create User Dialog Component
 * Confirms user creation with email
 * @class CreateUserDialogComponent
 */
@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Create Account</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>User with email "{{ data.email }}" does not exist.</p>
        <p>Would you like to create a new account?</p>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button color="primary" [mat-dialog-close]="true">
          Create Account
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    mat-card { padding: 16px; }
    mat-card-content { margin-top: 16px; }
    button { margin-left: 8px; }
  `]
})
export class CreateUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateUserDialogData
  ) {}
}
