import { Observable } from 'rxjs';

import { Task, CreateTaskRequest, UpdateTaskRequest } from '../models/task.model';
import { PaginatedResponse } from '../models/api-response.model';

/**
 * Task Service Interface
 * Defines the contract for task CRUD operations
 * @interface TaskServiceInterface
 */
export interface TaskServiceInterface {
  /**
   * Get all tasks for current user
   * @returns {Observable<Task[]>} Array of tasks
   */
  getTasks(): Observable<Task[]>;

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
   * @returns {Observable<Task>} Task details
   */
  getTask(id: string): Observable<Task>;

  /**
   * Create new task
   * @param {CreateTaskRequest} taskData - Task data
   * @returns {Observable<Task>} Created task
   */
  createTask(taskData: CreateTaskRequest): Observable<Task>;

  /**
   * Update existing task
   * @param {string} id - Task ID
   * @param {UpdateTaskRequest} taskData - Updated task data
   * @returns {Observable<Task>} Updated task
   */
  updateTask(id: string, taskData: UpdateTaskRequest): Observable<Task>;

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
   * @returns {Observable<Task>} Updated task
   */
  toggleTaskCompletion(id: string, completed: boolean): Observable<Task>;
}
