import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './base-query';

export interface Category {
  category_id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryCreateInput {
  name: string;
  description?: string;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string;
}

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQuery,
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getAllCategories: builder.query<Category[], void>({
      query: () => ({
        url: '/category/',
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    getCategoryById: builder.query<Category, number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, CategoryCreateInput>({
      query: (data) => ({
        url: '/category/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<Category, { id: number; data: CategoryUpdateInput }>({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
