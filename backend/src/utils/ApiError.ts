export class ApiError extends Error {
  public statusCode: number;
  public errors: Record<string, string>[];
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: Record<string, string>[] = [],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
