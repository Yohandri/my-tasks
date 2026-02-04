/**
 * Task interface representing a todo item
 * @interface Task
 */
export interface Task {
  /** Unique identifier */
  id: string;
  /** Task title */
  title: string;
  /** Task description */
  description: string;
  /** Task completion status */
  completed: boolean;
  /** User ID who owns the task */
  userId: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Create task request payload
 * @interface CreateTaskRequest
 */
export interface CreateTaskRequest {
  /** Task title */
  title: string;
  /** Task description */
  description: string;
}

/**
 * Update task request payload
 * @interface UpdateTaskRequest
 */
export interface UpdateTaskRequest {
  /** Optional task title */
  title?: string;
  /** Optional task description */
  description?: string;
  /** Optional completion status */
  completed?: boolean;
}
