# Error Handling System

This document outlines the comprehensive error handling system implemented in LinkMage to ensure a robust, production-ready application.

## Overview

The error handling system provides:
- **User-friendly error messages** that don't expose technical details
- **Retry functionality** for recoverable errors
- **Comprehensive logging** for debugging and monitoring
- **Graceful degradation** when services are unavailable
- **Type-safe error handling** with TypeScript

## Architecture

### 1. Error Handler (`src/lib/errorHandler.ts`)

The central error handling utility that provides:

#### Error Types
- **API Errors**: HTTP status code-based errors (400, 401, 403, 404, 500, etc.)
- **Network Errors**: Connection issues, timeouts, CORS errors
- **Validation Errors**: Input validation failures
- **Authentication Errors**: Login, permission issues
- **Database Errors**: Supabase/PostgreSQL errors

#### Error Properties
```typescript
interface AppError {
  code: string;           // Machine-readable error code
  message: string;        // Technical message for developers
  userMessage: string;    // User-friendly message
  severity: 'error' | 'warning' | 'info';
  retryable: boolean;     // Whether the error can be retried
  details?: any;          // Additional error context
}
```

#### Key Methods
- `ErrorHandler.handleApiError()`: Converts HTTP responses to AppError
- `ErrorHandler.handleNetworkError()`: Handles fetch/network errors
- `ErrorHandler.handleValidationError()`: Input validation errors
- `ErrorHandler.handleAuthError()`: Authentication-specific errors
- `ErrorHandler.handleDatabaseError()`: Database operation errors
- `ErrorHandler.logError()`: Structured error logging

### 2. API Call Utility (`apiCall`)

A wrapper around `fetch` that automatically:
- Handles HTTP error responses
- Converts network errors to AppError objects
- Logs errors with context
- Provides consistent error handling across the app

```typescript
const data = await apiCall<ResponseType>(
  '/api/endpoint',
  { method: 'POST', body: JSON.stringify(data) },
  'context description'
);
```

### 3. Enhanced Toast System (`src/hooks/use-toast.ts`)

Enhanced toast notifications that:
- Display user-friendly error messages
- Show retry buttons for recoverable errors
- Support different severity levels
- Provide consistent UI feedback

```typescript
const { showError, showSuccess, showWarning, showInfo } = useEnhancedToast();

// Show error with retry option
showError(error, () => retryFunction());

// Show success message
showSuccess('Operation completed successfully');
```

### 4. Error Boundary (`src/components/ErrorBoundary.tsx`)

React error boundary that:
- Catches unhandled JavaScript errors
- Displays a fallback UI
- Logs errors for debugging
- Provides recovery options (retry, go home)

## Error Categories

### 1. Client-Side Errors

#### Validation Errors (400)
- **Cause**: Invalid input data
- **User Message**: "Please check your input and try again."
- **Retryable**: Yes
- **Example**: Missing title/content for notes

#### Authentication Errors (401/403)
- **Cause**: Unauthorized access or expired sessions
- **User Message**: "Please sign in to continue."
- **Retryable**: No (requires user action)
- **Example**: Expired JWT token

#### Not Found Errors (404)
- **Cause**: Resource doesn't exist or user lacks permission
- **User Message**: "The requested resource was not found."
- **Retryable**: No
- **Example**: Trying to access deleted note

### 2. Server-Side Errors

#### Rate Limiting (429)
- **Cause**: Too many requests
- **User Message**: "Too many requests. Please wait a moment and try again."
- **Retryable**: Yes (after delay)
- **Example**: Rapid API calls

#### Server Errors (500)
- **Cause**: Internal server error
- **User Message**: "Something went wrong on our end. Please try again later."
- **Retryable**: Yes
- **Example**: Database connection issues

#### Service Unavailable (502/503/504)
- **Cause**: External service down
- **User Message**: "Our service is temporarily unavailable. Please try again later."
- **Retryable**: Yes
- **Example**: Supabase maintenance

### 3. Network Errors

#### Connection Errors
- **Cause**: No internet connection
- **User Message**: "Please check your internet connection and try again."
- **Retryable**: Yes
- **Example**: Network timeout

#### Request Cancelled
- **Cause**: User navigated away or request was aborted
- **User Message**: "The request was cancelled."
- **Retryable**: Yes
- **Example**: Component unmounted during API call

## Implementation Examples

### Frontend Error Handling

```typescript
// In a component
const handleSaveNote = async (title: string, content: string) => {
  try {
    const data = await apiCall<AiNote>(
      `/api/ai_notes?user_id=${user?.id}`,
      {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      },
      'saving note'
    );
    setNotes(prev => [data, ...prev]);
    showSuccess('Note created successfully');
  } catch (error) {
    showError(error, () => handleSaveNote(title, content));
  }
};
```

### API Route Error Handling

```javascript
// In an API route
export default async function handler(req, res) {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      console.error('Missing user_id in request:', { method: req.method, query: req.query });
      return res.status(400).json({ 
        error: 'Missing user_id',
        code: 'VALIDATION_ERROR',
        message: 'user_id is required for all operations'
      });
    }

    // ... API logic ...

  } catch (err) {
    console.error('Unexpected error in API:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
```

## Best Practices

### 1. Error Logging
- Always log errors with context (user ID, request details)
- Include stack traces in development
- Sanitize sensitive data before logging
- Use structured logging for better analysis

### 2. User Experience
- Provide clear, actionable error messages
- Offer retry options for recoverable errors
- Don't expose technical details to users
- Maintain app state during errors

### 3. API Design
- Use consistent error response format
- Include error codes for programmatic handling
- Validate inputs thoroughly
- Handle edge cases gracefully

### 4. Monitoring
- Monitor error rates and types
- Set up alerts for critical errors
- Track user impact of errors
- Use error analytics for improvement

## Error Recovery Strategies

### 1. Automatic Retry
- Network errors: Retry with exponential backoff
- Rate limiting: Wait and retry
- Server errors: Retry with user confirmation

### 2. Graceful Degradation
- Offline mode for critical features
- Cached data when API is unavailable
- Fallback UI for failed components

### 3. User Recovery
- Clear error messages with next steps
- Retry buttons for recoverable errors
- Alternative workflows when possible

## Testing Error Handling

### 1. Unit Tests
- Test error handler functions
- Verify error message formatting
- Test retry logic

### 2. Integration Tests
- Test API error responses
- Verify error boundary behavior
- Test toast notifications

### 3. Manual Testing
- Test network disconnection scenarios
- Verify error messages are user-friendly
- Test retry functionality

## Monitoring and Alerting

### 1. Error Tracking
- Log all errors with context
- Track error frequency and patterns
- Monitor user impact

### 2. Performance Monitoring
- Track API response times
- Monitor error rates by endpoint
- Alert on service degradation

### 3. User Feedback
- Collect user reports of errors
- Monitor support tickets
- Track user satisfaction after errors

This comprehensive error handling system ensures that LinkMage provides a robust, user-friendly experience even when things go wrong. 