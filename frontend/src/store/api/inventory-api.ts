import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './base-query';

export interface InventoryItem {
    item_id: number;
    sku: string;
    name: string;
    category: string;
    warehouse: string;
    quantity_on_hand: number;
    reorder_threshold: number;
    created_at: string;
    updated_at: string;
}

export interface InventoryCreateInput {
    sku: string;
    name: string;
    category: string;
    warehouse: string;
    quantity_on_hand: number;
    reorder_threshold: number;
}

export interface InventoryUpdateInput {
    sku?: string;
    name?: string;
    category?: string;
    warehouse?: string;
    quantity_on_hand?: number;
    reorder_threshold?: number;
}

export interface ImportResponse {
    total_rows: number;
    accepted_rows: number;
    rejected_rows: number;
    errors: Array<{
        row: number;
        error: string;
        data: Record<string, string>;
    }>;
    success: boolean;
}

export const inventoryApi = createApi({
    reducerPath: 'inventoryApi',
    baseQuery: baseQuery,
    tagTypes: ['Inventory'],
    endpoints: (builder) => ({
        getAllInventory: builder.query<InventoryItem[], void>({
            query: () => ({
                url: '/inventory/',
                method: 'GET',
            }),
            providesTags: ['Inventory'],
        }),
        getInventoryById: builder.query<InventoryItem, number>({
            query: (item_id) => ({
                url: `/inventory/${item_id}`,
                method: 'GET',
            }),
            providesTags: ['Inventory'],
        }),
        createInventory: builder.mutation<InventoryItem, InventoryCreateInput>({
            query: (data) => ({
                url: '/inventory/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Inventory'],
        }),
        updateInventory: builder.mutation<InventoryItem, { id: number; data: InventoryUpdateInput }>({
            query: ({ id, data }) => ({
                url: `/inventory/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Inventory'],
        }),
        deleteInventory: builder.mutation<{ success: boolean; message: string }, number>({
            query: (item_id) => ({
                url: `/inventory/${item_id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Inventory'],
        }),
        importInventory: builder.mutation<ImportResponse, FormData>({
            query: (formData) => ({
                url: '/inventory/import',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Inventory'],
        }),
    }),
});

export const {
    useGetAllInventoryQuery,
    useGetInventoryByIdQuery,
    useCreateInventoryMutation,
    useUpdateInventoryMutation,
    useDeleteInventoryMutation,
    useImportInventoryMutation,
} = inventoryApi;
