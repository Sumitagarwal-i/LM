export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  severity: 'error' | 'warning' | 'info';
  retryable: boolean;
  details?: any;
}

export class ErrorHandler {
  static createError(
    code: string,
    message: string,
    userMessage?: string,
    severity: 'error' | 'warning' | 'info' = 'error',
    retryable: boolean = false,
    details?: any
  ): AppError {
    return {
      code,
      message,
      userMessage: userMessage || message,
      severity,
      retryable,
      details
    };
  }

  static handleApiError(response: Response, context: string): AppError {
    const status = response.status;
    
    switch (status) {
      case 400:
        return this.createError(
          'VALIDATION_ERROR',
          `Bad request in ${context}`,
          'Please check your input and try again.',
          'error',
          true
        );
      
      case 401:
        return this.createError(
          'UNAUTHORIZED',
          `Unauthorized access in ${context}`,
          'Please sign in to continue.',
          'error',
          false
        );
      
      case 403:
        return this.createError(
          'FORBIDDEN',
          `Access forbidden in ${context}`,
          'You don\'t have permission to perform this action.',
          'error',
          false
        );
      
      case 404:
        return this.createError(
          'NOT_FOUND',
          `Resource not found in ${context}`,
          'The requested resource was not found.',
          'error',
          false
        );
      
      case 409:
        return this.createError(
          'CONFLICT',
          `Conflict in ${context}`,
          'This action conflicts with existing data.',
          'error',
          true
        );
      
      case 422:
        return this.createError(
          'VALIDATION_ERROR',
          `Validation failed in ${context}`,
          'Please check your input and try again.',
          'error',
          true
        );
      
      case 429:
        return this.createError(
          'RATE_LIMITED',
          `Rate limited in ${context}`,
          'Too many requests. Please wait a moment and try again.',
          'warning',
          true
        );
      
      case 500:
        return this.createError(
          'SERVER_ERROR',
          `Server error in ${context}`,
          'Something went wrong on our end. Please try again later.',
          'error',
          true
        );
      
      case 502:
      case 503:
      case 504:
        return this.createError(
          'SERVICE_UNAVAILABLE',
          `Service unavailable in ${context}`,
          'Our service is temporarily unavailable. Please try again later.',
          'error',
          true
        );
      
      default:
        return this.createError(
          'UNKNOWN_ERROR',
          `Unknown error (${status}) in ${context}`,
          'An unexpected error occurred. Please try again.',
          'error',
          true
        );
    }
  }

  static handleNetworkError(error: any, context: string): AppError {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return this.createError(
        'NETWORK_ERROR',
        `Network error in ${context}`,
        'Please check your internet connection and try again.',
        'error',
        true
      );
    }
    
    if (error.name === 'AbortError') {
      return this.createError(
        'REQUEST_CANCELLED',
        `Request cancelled in ${context}`,
        'The request was cancelled.',
        'info',
        true
      );
    }
    
    return this.createError(
      'UNKNOWN_ERROR',
      `Unknown error in ${context}: ${error.message}`,
      'An unexpected error occurred. Please try again.',
      'error',
      true,
      error
    );
  }

  static handleValidationError(field: string, message: string): AppError {
    return this.createError(
      'VALIDATION_ERROR',
      `Validation error for ${field}: ${message}`,
      `Please check the ${field} field: ${message}`,
      'error',
      true
    );
  }

  static handleAuthError(error: any): AppError {
    if (error.message?.includes('Invalid login credentials')) {
      return this.createError(
        'INVALID_CREDENTIALS',
        'Invalid login credentials',
        'Invalid email or password. Please try again.',
        'error',
        true
      );
    }
    
    if (error.message?.includes('Email not confirmed')) {
      return this.createError(
        'EMAIL_NOT_CONFIRMED',
        'Email not confirmed',
        'Please check your email and confirm your account.',
        'warning',
        false
      );
    }
    
    return this.createError(
      'AUTH_ERROR',
      `Authentication error: ${error.message}`,
      'Authentication failed. Please try again.',
      'error',
      true
    );
  }

  static handleDatabaseError(error: any, context: string): AppError {
    if (error.code === '23505') { // Unique constraint violation
      return this.createError(
        'DUPLICATE_ENTRY',
        `Duplicate entry in ${context}`,
        'This item already exists.',
        'error',
        false
      );
    }
    
    if (error.code === '23503') { // Foreign key violation
      return this.createError(
        'RELATED_DATA_ERROR',
        `Related data error in ${context}`,
        'This action cannot be completed due to related data.',
        'error',
        false
      );
    }
    
    return this.createError(
      'DATABASE_ERROR',
      `Database error in ${context}: ${error.message}`,
      'A database error occurred. Please try again.',
      'error',
      true,
      error
    );
  }

  static logError(error: AppError, additionalContext?: any) {
    console.error('App Error:', {
      ...error,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      additionalContext
    });
  }
}

// Utility function for API calls with error handling
export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
  context: string
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = ErrorHandler.handleApiError(response, context);
      ErrorHandler.logError(error, { url, options });
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      // This is already an AppError
      throw error;
    }
    
    const appError = ErrorHandler.handleNetworkError(error, context);
    ErrorHandler.logError(appError, { url, options, originalError: error });
    throw appError;
  }
} 