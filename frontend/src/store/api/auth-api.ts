import { ApiResponse } from '@/types/api-response';
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './base-query';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    user_id: number;
    fullname: string;
    email: string;
    access_token: string;
    token_type: string;
}
export interface RegisterResponse extends ApiResponse<{ email: string }> {}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;
