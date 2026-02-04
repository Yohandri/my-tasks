/**
 * Generic API response wrapper
 * @interface ApiResponse
 * @template T
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  /** Response message */
  message?: string;
  /** Success status */
  success: boolean;
}

/** API error response structure */
export interface ApiError {
  /** Error message */
  message: string;
  /** Error code */
  code?: string;
  /** Validation errors array */
  errors?: string[];
}

/** Paginated response structure */
export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Total count */
  total: number;
  /** Current page */
  page: number;
  /** Page size */
  pageSize: number;
  /** Total pages */
  totalPages: number;
}
