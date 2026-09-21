/**
 * Waste2Value — Normalized Application & Infrastructure Error
 * Adheres to Nielsen's error recovery heuristic:
 * Every error answers: "What happened?" and "What can I do now?"
 */

export type AppErrorCode =
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'DATABASE_ERROR'
  | 'AI_IDENTIFY_FAILED'
  | 'NO_RECEIVERS_FOUND'
  | 'UNKNOWN_ERROR';

export interface ErrorRecoveryAdvice {
  actionLabel?: string;
  actionType?: 'retry' | 're-authenticate' | 'navigate' | 're-upload';
  suggestedRoute?: string;
}

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly status?: number;
  public readonly userMessage: string;
  public readonly recoveryAdvice?: ErrorRecoveryAdvice;

  constructor(params: {
    message: string;
    code: AppErrorCode;
    userMessage?: string;
    status?: number;
    recoveryAdvice?: ErrorRecoveryAdvice;
  }) {
    super(params.message);
    this.name = 'AppError';
    this.code = params.code;
    this.status = params.status;
    this.userMessage = params.userMessage || params.message;
    this.recoveryAdvice = params.recoveryAdvice;
  }

  static networkError(details?: string): AppError {
    return new AppError({
      message: details || 'Network request failed',
      code: 'NETWORK_ERROR',
      userMessage: "You're offline or the connection timed out. Check your internet connection.",
      recoveryAdvice: { actionLabel: 'Retry', actionType: 'retry' },
    });
  }

  static unauthorized(details?: string): AppError {
    return new AppError({
      message: details || 'Authentication session expired or invalid',
      code: 'AUTHENTICATION_ERROR',
      status: 401,
      userMessage: 'Your session has expired. Please sign in again.',
      recoveryAdvice: { actionLabel: 'Sign in', actionType: 're-authenticate', suggestedRoute: '/login' },
    });
  }

  static forbidden(details?: string): AppError {
    return new AppError({
      message: details || 'Insufficient permissions for this operation',
      code: 'AUTHORIZATION_ERROR',
      status: 403,
      userMessage: 'You do not have permission to access or modify this resource.',
    });
  }

  static notFound(resourceName = 'Resource'): AppError {
    return new AppError({
      message: `${resourceName} not found`,
      code: 'NOT_FOUND',
      status: 404,
      userMessage: `The requested ${resourceName.toLowerCase()} could not be found.`,
    });
  }

  static validation(message: string, userMessage?: string): AppError {
    return new AppError({
      message,
      code: 'VALIDATION_ERROR',
      status: 400,
      userMessage: userMessage || message,
    });
  }

  static aiIdentificationFailed(): AppError {
    return new AppError({
      message: 'AI Vision could not confidently identify item',
      code: 'AI_IDENTIFY_FAILED',
      userMessage: "We couldn't confidently understand this image. Try another photo with better lighting or enter details manually.",
      recoveryAdvice: { actionLabel: 'Try Another Image', actionType: 're-upload' },
    });
  }

  static noReceiversFound(): AppError {
    return new AppError({
      message: 'No suitable receivers found for item and location',
      code: 'NO_RECEIVERS_FOUND',
      userMessage: 'No suitable matches found nearby. Try expanding your search radius or choosing another value path.',
    });
  }

  /**
   * Normalizes Supabase auth and PostgREST errors into clean user-facing AppError objects.
   * Strips raw SQL statements, database tables, and connection strings from user presentation.
   */
  static fromSupabase(error: unknown, fallbackMessage = 'An unexpected database error occurred.'): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (!error || typeof error !== 'object') {
      return new AppError({
        message: String(error || fallbackMessage),
        code: 'UNKNOWN_ERROR',
        userMessage: fallbackMessage,
      });
    }

    const err = error as {
      message?: string;
      code?: string;
      status?: number;
      details?: string;
      hint?: string;
    };

    const rawMessage = err.message || fallbackMessage;
    const pgCode = err.code || '';

    // Auth specific error cases
    if (rawMessage.toLowerCase().includes('invalid login credentials')) {
      return new AppError({
        message: rawMessage,
        code: 'AUTHENTICATION_ERROR',
        status: 400,
        userMessage: 'Invalid email or password. Please verify your credentials.',
      });
    }

    if (rawMessage.toLowerCase().includes('user already registered')) {
      return new AppError({
        message: rawMessage,
        code: 'VALIDATION_ERROR',
        status: 409,
        userMessage: 'An account with this email address already exists. Please sign in instead.',
        recoveryAdvice: { actionLabel: 'Sign In', actionType: 'navigate', suggestedRoute: '/login' },
      });
    }

    if (rawMessage.toLowerCase().includes('jwt') || rawMessage.toLowerCase().includes('session expired')) {
      return AppError.unauthorized(rawMessage);
    }

    // Postgres / PostgREST RLS and schema constraint error codes
    if (pgCode === '42501' || rawMessage.toLowerCase().includes('permission denied')) {
      return AppError.forbidden('RLS authorization policy prevented access to this record.');
    }

    if (pgCode === 'PGRST116') {
      return AppError.notFound('Requested item');
    }

    if (pgCode === '23505') {
      return new AppError({
        message: rawMessage,
        code: 'VALIDATION_ERROR',
        status: 409,
        userMessage: 'A duplicate record already exists with these unique properties.',
      });
    }

    if (pgCode === '23503') {
      return new AppError({
        message: rawMessage,
        code: 'VALIDATION_ERROR',
        status: 400,
        userMessage: 'The associated referenced record could not be found.',
      });
    }

    if (pgCode === '23514') {
      return new AppError({
        message: rawMessage,
        code: 'VALIDATION_ERROR',
        status: 400,
        userMessage: 'The provided data values did not satisfy business constraints.',
      });
    }

    if (rawMessage.toLowerCase().includes('fetch') || rawMessage.toLowerCase().includes('network')) {
      return AppError.networkError(rawMessage);
    }

    return new AppError({
      message: rawMessage,
      code: 'DATABASE_ERROR',
      status: err.status || 500,
      userMessage: fallbackMessage,
      recoveryAdvice: { actionLabel: 'Retry', actionType: 'retry' },
    });
  }
}
