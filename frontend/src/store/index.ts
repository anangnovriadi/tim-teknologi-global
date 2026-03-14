import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
import { authApi } from './api/auth-api';
import { inventoryApi } from './api/inventory-api';
import { importLogsApi } from './api/import-logs-api';

const rootReducer = combineReducers({
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    [importLogsApi.reducerPath]: importLogsApi.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            authApi.middleware,
            inventoryApi.middleware,
            importLogsApi.middleware,
        ]),
});

export type IRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
