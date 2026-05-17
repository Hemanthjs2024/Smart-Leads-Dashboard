import { PaginationMeta } from '../types';

export class ApiResponse<T = unknown> {
  public success: boolean;
  public message: string;
  public data: T;
  public pagination?: PaginationMeta;

  constructor(message: string, data: T, pagination?: PaginationMeta) {
    this.success = true;
    this.message = message;
    this.data = data;
    if (pagination) {
      this.pagination = pagination;
    }
  }
}
