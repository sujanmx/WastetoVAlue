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
  | 'AI_AUTH_REQUIRED'
  | 'AI_INVALID_IMAGE'
  | 'AI_UNSUPPORTED_IMAGE'
  | 'AI_IMAGE_TOO_LARGE'
  | 'AI_RATE_LIMITED'
  | 'AI_PROVIDER_UNAVAILABLE'
  | 'AI_TIMEOUT'
  | 'AI_INVALID_OUTPUT'
  | 'AI_CONTENT_REJECTED'
  | 'AI_UNKNOWN_ERROR'
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

  static aiAuthRequired(): AppError {
    return new AppError({
      message: 'Sign in required for AI analysis',
      code: 'AI_AUTH_REQUIRED',
      status: 401,
      userMessage: 'Please sign in to analyze your items with Gemini Vision AI.',
      recoveryAdvice: { actionLabel: 'Sign in', actionType: 're-authenticate', suggestedRoute: '/login' },
    });
  }

  static aiRateLimited(): AppError {
    return new AppError({
      message: 'AI analysis quota exceeded',
      code: 'AI_RATE_LIMITED',
      status: 429,
      userMessage: 'AI analysis is currently experiencing high demand. Please wait a few moments and try again.',
      recoveryAdvice: { actionLabel: 'Retry', actionType: 'retry' },
    });
  }

  static aiTimeout(): AppError {
    return new AppError({
      message: 'AI Vision analysis timed out',
      code: 'AI_TIMEOUT',
      status: 504,
      userMessage: 'The AI analysis request timed out. Please check your connection and retry.',
      recoveryAdvice: { actionLabel: 'Retry', actionType: 'retry' },
    });
  }

  static aiProviderUnavailable(details?: string): AppError {
    return new AppError({
      message: details || 'Gemini AI service unavailable',
      code: 'AI_PROVIDER_UNAVAILABLE',
      status: 503,
      userMessage: 'The AI service is temporarily unavailable. Please try again in a few moments.',
      recoveryAdvice: { actionLabel: 'Retry', actionType: 'retry' },
    });
  }

  static fromAiEdgeFunction(error: unknown): AppError {
    if (error instanceof AppError) return error;

    if (error && typeof error === 'object') {
      const errObj = error as {
        code?: string;
        message?: string;
        name?: string;
        status?: number;
        context?: { status?: number };
      };

      const name = errObj.name || '';
      const code = errObj.code || '';
      const message = errObj.message || '';
      const httpStatus = errObj.status || errObj.context?.status;

      // Handle Supabase FunctionsFetchError (network, CORS preflight, or dead idle connection)
      if (
        name === 'FunctionsFetchError' ||
        message.includes('Failed to send a request to the Edge Function') ||
        message.toLowerCase().includes('failed to fetch') ||
        message.toLowerCase().includes('networkerror')
      ) {
        return new AppError({
          message: 'Connection to Edge Function failed (FunctionsFetchError)',
          code: 'NETWORK_ERROR',
          status: 0,
          userMessage: 'Unable to connect to the AI analysis service. Please check your connection and retry.',
          recoveryAdvice: { actionLabel: 'Retry Analysis', actionType: 'retry' },
        });
      }

      // Handle Supabase FunctionsRelayError (relay gateway unavailable)
      if (name === 'FunctionsRelayError' || message.toLowerCase().includes('relay')) {
        return new AppError({
          message: 'Edge Function relay gateway unavailable (FunctionsRelayError)',
          code: 'AI_PROVIDER_UNAVAILABLE',
          status: 503,
          userMessage: 'The AI service gateway is temporarily unavailable. Please try again shortly.',
          recoveryAdvice: { actionLabel: 'Retry Analysis', actionType: 'retry' },
        });
      }

      // Status code mappings from Edge Function responses
      if (httpStatus === 401 || code === 'AI_AUTH_REQUIRED') {
        return AppError.aiAuthRequired();
      }
      if (httpStatus === 403 || code === 'AI_FORBIDDEN') {
        return AppError.forbidden('You do not have permission to analyze this item.');
      }
      if (httpStatus === 429 || code === 'AI_RATE_LIMITED') {
        return AppError.aiRateLimited();
      }
      if (httpStatus === 504 || code === 'AI_TIMEOUT') {
        return AppError.aiTimeout();
      }
      if (httpStatus === 503 || code === 'AI_PROVIDER_UNAVAILABLE') {
        return AppError.aiProviderUnavailable(message);
      }

      switch (code) {
        case 'AI_AUTH_REQUIRED':
          return AppError.aiAuthRequired();
        case 'AI_FORBIDDEN':
          return AppError.forbidden('You do not have permission to analyze this item.');
        case 'AI_IMAGE_TOO_LARGE':
          return new AppError({
            message: 'Image exceeds 10MB limit',
            code: 'AI_IMAGE_TOO_LARGE',
            status: 413,
            userMessage: 'Image file is too large. Please select a photo under 10MB.',
            recoveryAdvice: { actionLabel: 'Select Another Photo', actionType: 're-upload' },
          });
        case 'AI_UNSUPPORTED_IMAGE':
          return new AppError({
            message: message || 'Unsupported image format',
            code: 'AI_UNSUPPORTED_IMAGE',
            status: 415,
            userMessage: 'Unsupported image format. Please use JPEG, PNG, or WebP.',
            recoveryAdvice: { actionLabel: 'Select Another Photo', actionType: 're-upload' },
          });
        case 'AI_RATE_LIMITED':
          return AppError.aiRateLimited();
        case 'AI_TIMEOUT':
          return AppError.aiTimeout();
        case 'AI_CONTENT_REJECTED':
          return new AppError({
            message: 'Image flagged by safety filter',
            code: 'AI_CONTENT_REJECTED',
            status: 422,
            userMessage: 'This image could not be processed by safety guidelines. Please upload a clear photo of your item.',
            recoveryAdvice: { actionLabel: 'Try Another Image', actionType: 're-upload' },
          });
        case 'AI_INVALID_IMAGE':
          return new AppError({
            message: message || 'Image payload is missing or invalid',
            code: 'AI_INVALID_IMAGE',
            status: 400,
            userMessage: 'The provided image is invalid or empty. Please select a valid photo.',
            recoveryAdvice: { actionLabel: 'Select Another Photo', actionType: 're-upload' },
          });
        case 'AI_INVALID_OUTPUT':
          return new AppError({
            message: message || 'Gemini output structure mismatch',
            code: 'AI_INVALID_OUTPUT',
            status: 502,
            userMessage: 'The AI service returned an unexpected response. Please try again.',
            recoveryAdvice: { actionLabel: 'Retry', actionType: 'retry' },
          });
        case 'AI_PROVIDER_UNAVAILABLE':
          return AppError.aiProviderUnavailable(message);
      }
    }

    const fallbackMsg = typeof error === 'string' ? error : (error as { message?: string })?.message || 'AI analysis failed';
    return new AppError({
      message: fallbackMsg,
      code: 'AI_UNKNOWN_ERROR',
      userMessage: 'AI analysis could not be completed. Please try again.',
      recoveryAdvice: { actionLabel: 'Retry', actionType: 'retry' },
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
