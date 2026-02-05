import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../../core/models/task.model';

/**
 * Dialog data interface
 */
export interface TaskDeleteDialogData {
  task: Task;
}

/**
 * Task Delete Confirmation Dialog Component
 * @class TaskDeleteDialogComponent
 */
@Component({
  selector: 'app-task-delete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Delete Task</h2>
    
    <mat-dialog-content>
      <p>Are you sure you want to delete the task "{{ data.task.title }}"?</p>
      <p>This action cannot be undone.</p>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" type="button" (click)="onConfirm()">
        Delete
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      padding: 16px 0;
    }

    mat-dialog-content p {
      margin: 8px 0;
      color: #666;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class TaskDeleteDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TaskDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDeleteDialogData
  ) {}

  /**
   * Handle confirmation
   * @returns {void}
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Handle cancellation
   * @returns {void}
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
