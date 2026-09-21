import { describe, it, expect } from 'vitest';
import { AppError } from '../services/api/apiError';

describe('AppError Normalization & Security', () => {
  it('normalizes PostgREST 42501 permission denied into clean AUTHORIZATION_ERROR without leaking internals', () => {
    const rawPgError = {
      message: 'permission denied for table items',
      code: '42501',
      details: 'Failing row contains (sensitive_token, user_123)',
    };

    const normalized = AppError.fromSupabase(rawPgError);
    expect(normalized.code).toBe('AUTHORIZATION_ERROR');
    expect(normalized.status).toBe(403);
    expect(normalized.userMessage).toBe('You do not have permission to access or modify this resource.');
    // Ensures internal table details and tokens are not in user message
    expect(normalized.userMessage).not.toContain('sensitive_token');
    expect(normalized.userMessage).not.toContain('table items');
  });

  it('normalizes PGRST116 single row not found into NOT_FOUND', () => {
    const rawPgError = {
      message: 'JSON object requested, multiple (or no) rows returned',
      code: 'PGRST116',
    };

    const normalized = AppError.fromSupabase(rawPgError);
    expect(normalized.code).toBe('NOT_FOUND');
    expect(normalized.status).toBe(404);
  });

  it('normalizes unique constraint violations into user-friendly validation error', () => {
    const rawPgError = {
      message: 'duplicate key value violates unique constraint "items_pkey"',
      code: '23505',
    };

    const normalized = AppError.fromSupabase(rawPgError);
    expect(normalized.code).toBe('VALIDATION_ERROR');
    expect(normalized.userMessage).toContain('duplicate record already exists');
  });

  it('normalizes invalid login credentials into actionable authentication error', () => {
    const authError = {
      message: 'Invalid login credentials',
      status: 400,
    };

    const normalized = AppError.fromSupabase(authError);
    expect(normalized.code).toBe('AUTHENTICATION_ERROR');
    expect(normalized.userMessage).toContain('Invalid email or password');
  });
});
