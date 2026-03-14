import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './base-query';

export interface ImportLog {
  log_id: number;
  import_type: string;
  total_rows: number;
  accepted_rows: number;
  rejected_rows: number;
  errors: Array<{ row: number; error: string; data?: any }>;
  status: string;
  created_at: string;
}

export const importLogsApi = createApi({
  reducerPath: 'importLogsApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getImportLogs: builder.query<ImportLog[], { importType?: string; limit?: number }>({
      query: ({ importType, limit = 50 }) => {
        let url = '/import-logs/logs';
        const params = new URLSearchParams();
        if (importType) params.append('import_type', importType);
        params.append('limit', limit.toString());
        if (params.toString()) url += `?${params.toString()}`;
        return url;
      },
    }),
    getImportLogDetail: builder.query<ImportLog, number>({
      query: (logId) => `/import-logs/logs/${logId}`,
    }),
  }),
});

export const { useGetImportLogsQuery, useGetImportLogDetailQuery } = importLogsApi;
