import { useState, useCallback, useEffect, useRef } from 'react';
import { AsyncState, LoadingStatus } from '../types/common';
import { AppError } from '../services/api/apiError';

interface UseAsyncOptions<T> {
  immediate?: boolean;
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: AppError) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const { immediate = false, initialData = null, onSuccess, onError } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    status: immediate ? 'loading' : 'idle',
    error: null,
    isLoading: immediate,
    isSuccess: false,
    isError: false,
  });

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (): Promise<T | null> => {
    if (!mountedRef.current) return null;

    setState((prev) => ({
      ...prev,
      status: 'loading' as LoadingStatus,
      isLoading: true,
      isError: false,
      error: null,
    }));

    try {
      const result = await asyncFunction();
      if (mountedRef.current) {
        setState({
          data: result,
          status: 'success',
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
        onSuccess?.(result);
      }
      return result;
    } catch (err: unknown) {
      if (mountedRef.current) {
        const appError =
          err instanceof AppError
            ? err
            : new AppError({
                message: err instanceof Error ? err.message : 'An error occurred',
                code: 'UNKNOWN_ERROR',
              });

        setState((prev) => ({
          ...prev,
          status: 'error',
          error: appError.userMessage,
          isLoading: false,
          isSuccess: false,
          isError: true,
        }));
        onError?.(appError);
      }
      return null;
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      status: 'idle',
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, [initialData]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reload: execute,
    reset,
  };
}
