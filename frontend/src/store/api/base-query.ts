import { BaseQueryApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearToken } from '@/store/auth-slice';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { API_URL } from '@/constants/api';
import { COOKIE_KEYS } from '@/constants/cookies';
import { ROUTES } from '@/constants/routes';

export const baseQueryAuth = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = Cookies.get(COOKIE_KEYS.AUTH_TOKEN);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQuery = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  const result = await baseQueryAuth(args, api, extraOptions);

  if (result?.error?.status === 401 || result?.error?.status === 403) {
    const url = typeof args === 'string' ? args : args.url || '';
    
    // Don't redirect for login endpoint - let login page handle error
    if (!url.includes('/login')) {
      api.dispatch(clearToken());
      Cookies.remove(COOKIE_KEYS.AUTH_TOKEN);

      if (typeof window !== 'undefined') {
        window.location.href = ROUTES.AUTH.LOGIN;
      }

      toast.error("Invalid or expired token", {
        id: 'token-expired',
        duration: 2000,
      });
    }
  }

  return result;
};
