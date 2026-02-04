import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TaskServiceInterface } from '../../core/services/task.service.interface';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../core/models/task.model';
import { PaginatedResponse } from '../../core/models/api-response.model';
import { environment } from '../../../environments/environment';

/**
 * Task Service Implementation
 * Handles task CRUD operations with the API
 * @class TaskService
 * @implements {TaskServiceInterface}
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService implements TaskServiceInterface {
  /** API endpoint */
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  /**
   * Get all tasks for current user
   * @returns {Observable<Task[]>} Array of tasks
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Get paginated tasks
   * @param {number} page - Page number (1-indexed)
   * @param {number} pageSize - Items per page
   * @returns {Observable<PaginatedResponse<Task>>} Paginated response
   */
  getTasksPaginated(page: number, pageSize: number): Observable<PaginatedResponse<Task>> {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    return this.http.get<PaginatedResponse<Task>>(this.apiUrl, { params });
  }

  /**
   * Get single task by ID
   * @param {string} id - Task ID
   * @returns {Observable<Task>} Task details
   */
  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new task
   * @param {CreateTaskRequest} taskData - Task data
   * @returns {Observable<Task>} Created task
   */
  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, taskData);
  }

  /**
   * Update existing task
   * @param {string} id - Task ID
   * @param {UpdateTaskRequest} taskData - Updated task data
   * @returns {Observable<Task>} Updated task
   */
  updateTask(id: string, taskData: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, taskData);
  }

  /**
   * Delete task
   * @param {string} id - Task ID
   * @returns {Observable<void>} Completion signal
   */
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Toggle task completion status
   * @param {string} id - Task ID
   * @param {boolean} completed - New completion status
   * @returns {Observable<Task>} Updated task
   */
  toggleTaskCompletion(id: string, completed: boolean): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, { completed });
  }
}
