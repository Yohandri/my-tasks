import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TaskServiceInterface } from '../../core/services/task.service.interface';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../core/models/task.model';
import { ApiResponse, PaginatedResponse } from '../../core/models/api-response.model';
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
   * @returns {Observable<ApiResponse<{tasks: Task[]}>>} Response with tasks array
   */
  getTasks(): Observable<ApiResponse<{tasks: Task[]}>> {
    return this.http.get<ApiResponse<{tasks: Task[]}>>(this.apiUrl);
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
   * @returns {Observable<ApiResponse<Task>>} Task details response
   */
  getTask(id: string): Observable<ApiResponse<Task>> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new task
   * @param {CreateTaskRequest} taskData - Task data
   * @returns {Observable<ApiResponse<{task: Task}>>} Created task response
   */
  createTask(taskData: CreateTaskRequest): Observable<ApiResponse<{task: Task}>> {
    return this.http.post<ApiResponse<{task: Task}>>(this.apiUrl, taskData);
  }

  /**
   * Update existing task
   * @param {string} id - Task ID
   * @param {UpdateTaskRequest} taskData - Updated task data
   * @returns {Observable<ApiResponse<{task: Task}>>} Updated task response
   */
  updateTask(id: string, taskData: UpdateTaskRequest): Observable<ApiResponse<{task: Task}>> {
    return this.http.put<ApiResponse<{task: Task}>>(`${this.apiUrl}/${id}`, taskData);
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
   * @returns {Observable<ApiResponse<{task: Task}>>} Updated task response
   */
  toggleTaskCompletion(id: string, completed: boolean): Observable<ApiResponse<{task: Task}>> {
    return this.http.put<ApiResponse<{task: Task}>>(`${this.apiUrl}/${id}`, { completed });
  }
}
