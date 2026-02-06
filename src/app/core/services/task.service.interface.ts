import { Observable } from 'rxjs';

import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

/**
 * Task Service Interface
 * Defines the contract for task CRUD operations
 * @interface TaskServiceInterface
 */
export interface TaskServiceInterface {
  /**
   * Get all tasks for current user
   * @returns {Observable<ApiResponse<{tasks: Task[]}>>} Response with tasks array
   */
  getTasks(): Observable<ApiResponse<{tasks: Task[]}>>;

  /**
   * Get paginated tasks
   * @param {number} page - Page number
   * @param {number} pageSize - Items per page
   * @returns {Observable<PaginatedResponse<Task>>} Paginated response
   */
  getTasksPaginated(page: number, pageSize: number): Observable<PaginatedResponse<Task>>;

  /**
   * Get single task by ID
   * @param {string} id - Task ID
   * @returns {Observable<ApiResponse<Task>>} Task details response
   */
  getTask(id: string): Observable<ApiResponse<Task>>;

  /**
   * Create new task
   * @param {CreateTaskRequest} taskData - Task data
   * @returns {Observable<ApiResponse<{task: Task}>>} Created task response
   */
  createTask(taskData: CreateTaskRequest): Observable<ApiResponse<{task: Task}>>;

  /**
   * Update existing task
   * @param {string} id - Task ID
   * @param {UpdateTaskRequest} taskData - Updated task data
   * @returns {Observable<ApiResponse<{task: Task}>>} Updated task response
   */
  updateTask(id: string, taskData: UpdateTaskRequest): Observable<ApiResponse<{task: Task}>>;

  /**
   * Delete task
   * @param {string} id - Task ID
   * @returns {Observable<void>} Completion signal
   */
  deleteTask(id: string): Observable<void>;

  /**
   * Toggle task completion status
   * @param {string} id - Task ID
   * @param {boolean} completed - New completion status
   * @returns {Observable<ApiResponse<{task: Task}>>} Updated task response
   */
  toggleTaskCompletion(id: string, completed: boolean): Observable<ApiResponse<{task: Task}>>;
}
