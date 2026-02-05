import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../../core/models/task.model';

/**
 * Dialog data interface
 */
export interface TaskEditDialogData {
  task: Task;
}

/**
 * Dialog result interface
 */
export interface TaskEditDialogResult {
  title: string;
  description: string;
}

/**
 * Task Edit Dialog Component
 * Provides a responsive reactive form for editing task details
 * @class TaskEditDialogComponent
 */
@Component({
  selector: 'app-task-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Task</h2>
    
    <mat-dialog-content>
      <form [formGroup]="editForm" class="task-edit-form">
        <!-- Title Field (Required) -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="Task title">
          <mat-error *ngIf="editForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
          <mat-error *ngIf="editForm.get('title')?.hasError('maxlength')">
            Title must be at most 100 characters
          </mat-error>
        </mat-form-field>

        <!-- Description Field (Optional) -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Task description" rows="3"></textarea>
          <mat-error *ngIf="editForm.get('description')?.hasError('maxlength')">
            Description must be at most 500 characters
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button type="button" (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              type="submit" 
              [disabled]="editForm.invalid"
              (click)="onSubmit()">
        Save
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .task-edit-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 300px;
      max-width: 450px;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      padding-top: 16px;
    }

    .dialog-actions {
      padding: 16px 24px;
    }

    @media (max-width: 480px) {
      .task-edit-form {
        min-width: 100%;
      }

      .dialog-actions {
        flex-direction: column-reverse;
        gap: 8px;
      }

      .dialog-actions button {
        width: 100%;
      }
    }
  `]
})
export class TaskEditDialogComponent implements OnInit {
  /** Edit form */
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskEditDialogData
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  /**
   * Initialize component - pre-populate form with task data
   * @returns {void}
   */
  ngOnInit(): void {
    const task = this.data.task;
    this.editForm.patchValue({
      title: task.title,
      description: task.description
    });
  }

  /**
   * Handle form submission
   * @returns {void}
   */
  onSubmit(): void {
    if (this.editForm.valid) {
      const result: TaskEditDialogResult = this.editForm.value;
      this.dialogRef.close(result);
    }
  }

  /**
   * Handle dialog cancellation
   * @returns {void}
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
