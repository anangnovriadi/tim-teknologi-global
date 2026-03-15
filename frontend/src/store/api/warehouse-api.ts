import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './base-query';

export interface Warehouse {
  warehouse_id: number;
  name: string;
  location?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WarehouseCreateInput {
  name: string;
  location?: string;
  description?: string;
}

export interface WarehouseUpdateInput {
  name?: string;
  location?: string;
  description?: string;
}

export const warehouseApi = createApi({
  reducerPath: 'warehouseApi',
  baseQuery: baseQuery,
  tagTypes: ['Warehouse'],
  endpoints: (builder) => ({
    getAllWarehouses: builder.query<Warehouse[], void>({
      query: () => ({
        url: '/warehouse/',
        method: 'GET',
      }),
      providesTags: ['Warehouse'],
    }),
    getWarehouseById: builder.query<Warehouse, number>({
      query: (id) => ({
        url: `/warehouse/${id}`,
        method: 'GET',
      }),
      providesTags: ['Warehouse'],
    }),
    createWarehouse: builder.mutation<Warehouse, WarehouseCreateInput>({
      query: (data) => ({
        url: '/warehouse/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    updateWarehouse: builder.mutation<Warehouse, { id: number; data: WarehouseUpdateInput }>({
      query: ({ id, data }) => ({
        url: `/warehouse/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    deleteWarehouse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/warehouse/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Warehouse'],
    }),
  }),
});

export const {
  useGetAllWarehousesQuery,
  useGetWarehouseByIdQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
} = warehouseApi;
