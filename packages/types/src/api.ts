/** Canonical API envelope — see documents/API_STANDARDS.md. Never break v1. */

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  [key: string]: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  success: false;
  code: ApiErrorCode;
  message: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'TENANT_REQUIRED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/** `?sort=createdAt:desc` */
export type SortDirection = 'asc' | 'desc';
