import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setLoading,
  setError,
  loginSuccess,
  signupSuccess,
  logout as logoutAction,
  clearError,
} from '../redux/slices/authSlice';
import { authApi, type LoginCredentials, type SignupData } from '../api/auth';

// Module-level flag to track if auth initialization has started
let authInitStarted = false;

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);
  const initRef = useRef(false);

  /**
   * Initialize auth state on mount - only runs once globally
   */
  useEffect(() => {
    // Skip if already initialized or currently authenticated
    if (initRef.current || authInitStarted || authState.isAuthenticated) {
      return;
    }

    initRef.current = true;
    authInitStarted = true;

    const initAuth = async () => {
      dispatch(setLoading(true));
      try {
        const user = await authApi.getCurrentUser();
        if (user) {
          dispatch(loginSuccess({ user, rememberMe: !!localStorage.getItem('auth_token') }));
        } else {
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error('Auth init error:', error);
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch, authState.isAuthenticated]);

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const response = await authApi.login(credentials);

        dispatch(
          loginSuccess({
            user: response.data.customer,
            rememberMe: credentials.rememberMe || false,
          })
        );

        return { success: true, message: response.message };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Login failed. Please try again.';
        dispatch(setError(errorMessage));
        return { success: false, message: errorMessage };
      }
    },
    [dispatch]
  );

  /**
   * Signup new user
   */
  const signup = useCallback(
    async (signupData: SignupData) => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const response = await authApi.signup(signupData);

        dispatch(signupSuccess(response.data.customer));

        return { success: true, message: response.message };
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Signup failed. Please try again.';
        dispatch(setError(errorMessage));
        return { success: false, message: errorMessage };
      }
    },
    [dispatch]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      dispatch(logoutAction());
      router.push('/');
    }
  }, [dispatch, router]);

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      const response = await authApi.requestPasswordReset(email);
      return { success: true, message: response.message };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to send reset email. Please try again.';
      return { success: false, message: errorMessage };
    }
  }, []);

  /**
   * Refresh user data from server
   */
  const refreshUser = useCallback(async () => {
    try {
      const user = await authApi.getCurrentUser();
      if (user) {
        dispatch(loginSuccess({ user, rememberMe: !!localStorage.getItem('auth_token') }));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [dispatch]);

  /**
   * Clear error message
   */
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...authState,
    login,
    signup,
    logout,
    requestPasswordReset,
    refreshUser,
    clearError: clearAuthError,
  };
}
