import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { TaskService } from '../../../../infrastructure/services/task.service';
import { AuthService } from '../../../../infrastructure/services/auth.service';
import { Task } from '../../../../core/models/task.model';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskEditDialogComponent, TaskEditDialogResult } from './task-edit-dialog.component';
import { TaskDeleteDialogComponent } from './task-delete-dialog.component';

/**
 * Task List Component
 * Displays and manages user's tasks with CRUD operations
 * @class TaskListComponent
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="tasks-container">
      <!-- Header -->
      <div class="tasks-header">
        <h1>My Tasks</h1>
        <button mat-stroked-button color="warn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </div>

      <!-- Add Task Form -->
      <mat-card class="add-task-card">
        <form [formGroup]="taskForm" (ngSubmit)="createTask()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="title-field">
              <mat-label>New Task</mat-label>
              <input matInput #titleInput formControlName="title" placeholder="What needs to be done?">
              <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
              <mat-error *ngIf="taskForm.get('title')?.hasError('maxlength')">
                Title must be at most 20 characters
              </mat-error>
              <mat-error *ngIf="taskForm.get('title')?.hasError('pattern')">
                Title can only contain letters, numbers, and spaces
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="desc-field">
              <mat-label>Description (optional)</mat-label>
              <input matInput formControlName="description" placeholder="Add details...">
              <mat-error *ngIf="taskForm.get('description')?.hasError('maxlength')">
              Description must be at most 50 characters
            </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" 
                    [disabled]="taskForm.invalid || isLoading()">
              <mat-spinner *ngIf="isLoading()" diameter="20"></mat-spinner>
              <span class="btn-add" *ngIf="!isLoading()">
                <mat-icon>add</mat-icon>
                Add
              </span>
            </button>
          </div>
        </form>
      </mat-card>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading()" class="loading-container">
        <mat-spinner></mat-spinner>
      </div>

      <!-- Task List -->
      <div *ngIf="!isLoading()" class="task-list">
        <mat-card *ngFor="let task of tasks(); trackBy: trackByTaskId" class="task-card"
                  [class.completed]="task.completed">
          <div class="task-content">
            <mat-checkbox [checked]="task.completed" 
                         (change)="toggleTaskCompletion(task)"
                         color="primary">
            </mat-checkbox>
            
            <div class="task-details" [class.strikethrough]="task.completed">
              <h3 class="task-title">{{ task.title }}</h3>
              <p class="task-description" *ngIf="task.description">{{ task.description }}</p>
              <span class="task-date">Created: {{ task.createdAt | date:'medium' }}</span>
            </div>

            <div class="task-actions">
              <button mat-icon-button color="primary" (click)="editTask(task)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteTask(task)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </mat-card>

        <!-- Empty State -->
        <div *ngIf="tasks().length === 0" class="empty-state">
          <mat-icon>check_circle</mat-icon>
          <p>No tasks yet. Add your first task above!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tasks-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .tasks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .tasks-header h1 {
      margin: 0;
      color: #333;
    }

    .add-task-card {
      margin-bottom: 24px;
      padding: 20px;
    }

    .add-task-card button[mat-raised-button] {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 100px;
    }

    .add-task-card mat-spinner {
      display: inline-block;
    }

    .btn-add {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .title-field {
      flex: 1;
      min-width: 200px;
    }

    .desc-field {
      flex: 2;
      min-width: 200px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .task-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .task-card {
      transition: all 0.3s ease;
    }

    .task-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .task-card.completed {
      opacity: 0.7;
      background: #f5f5f5;
    }

    .task-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      padding: 12px;
    }

    .task-details {
      flex: 1;
    }

    .task-details.strikethrough {
      text-decoration: line-through;
      opacity: 0.7;
    }

    .task-title {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 500;
    }

    .task-description {
      margin: 0 0 8px;
      color: #666;
      font-size: 14px;
    }

    .task-date {
      font-size: 12px;
      color: #999;
    }

    .task-actions {
      display: flex;
      gap: 4px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
      }

      .title-field, .desc-field {
        width: 100%;
      }

      .task-content {
        flex-wrap: wrap;
      }

      .task-actions {
        width: 100%;
        justify-content: flex-end;
        margin-top: 8px;
      }
    }
  `]
})
export class TaskListComponent implements OnInit, OnDestroy {
  /** Tasks array */
  tasks = signal<Task[]>([]);

  /** Task form */
  taskForm: FormGroup;

  /** Loading state signal */
  isLoading = signal(false);

  /** ViewChild for title input */
  @ViewChild('titleInput') titleInput!: ElementRef<HTMLInputElement>;

  /** Destroy subject for cleanup */
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      description: ['', Validators.maxLength(50)]
    });
  }

  /**
   * Initialize component - load tasks and focus title input
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadTasks();
    // Focus title input after view is ready
    setTimeout(() => {
      if (this.titleInput) {
        this.titleInput.nativeElement.focus();
      }
    }, 0);
  }

  /**
   * Cleanup on destroy
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * TrackBy function for ngFor optimization
   * @param {number} index - Index
   * @param {Task} task - Task item
   * @returns {string} Task ID
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  /**
   * Load tasks from API
   * @returns {void}
   */
  loadTasks(): void {
    this.isLoading.set(true);
    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
        }
      });
  }

  /**
   * Create new task
   * @returns {void}
   */
  createTask(): void {
    if (this.taskForm.invalid) return;

    const { title, description } = this.taskForm.value;
    this.isLoading.set(true);

    this.taskService.createTask({ title, description: description || '' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task) => {
          this.tasks.update(tasks => [task, ...tasks]);
          this.taskForm.reset();
          this.isLoading.set(false);
          this.snackBar.open('Task created', 'Close', { duration: 2000 });
          // Focus title input after task creation
          setTimeout(() => {
            if (this.titleInput) {
              this.titleInput.nativeElement.focus();
            }
          }, 0);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.open('Failed to create task', 'Close', { duration: 3000 });
        }
      });
  }

  /**
   * Toggle task completion status
   * @param {Task} task - Task to toggle
   * @returns {void}
   */
  toggleTaskCompletion(task: Task): void {
    const newStatus = !task.completed;
    this.taskService.toggleTaskCompletion(task.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTask) => {
          this.tasks.update(tasks => 
            tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
          );
        },
        error: (error) => {
          this.snackBar.open('Failed to update task', 'Close', { duration: 3000 });
        }
      });
  }

  /**
   * Edit task - open edit dialog
   * @param {Task} task - Task to edit
   * @returns {void}
   */
  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskEditDialogComponent, {
      width: '450px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe((result: TaskEditDialogResult | undefined) => {
      if (result) {
        this.taskService.updateTask(task.id, {
          title: result.title,
          description: result.description
        }).pipe(takeUntil(this.destroy$)).subscribe({
          next: (updatedTask) => {
            this.tasks.update(tasks => 
              tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
            );
            this.snackBar.open('Task updated', 'Close', { duration: 2000 });
          },
          error: (error) => {
            this.snackBar.open('Failed to update task', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  /**
   * Delete task - show confirmation dialog
   * @param {Task} task - Task to delete
   * @returns {void}
   */
  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskDeleteDialogComponent, {
      width: '400px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.taskService.deleteTask(task.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.tasks.update(tasks => tasks.filter(t => t.id !== task.id));
              this.snackBar.open('Task deleted', 'Close', { duration: 2000 });
            },
            error: (error) => {
              this.snackBar.open('Failed to delete task', 'Close', { duration: 3000 });
            }
          });
      }
    });
  }

  /**
   * Logout user
   * @returns {void}
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
