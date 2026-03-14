import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
import { authApi } from './api/auth-api';
import { inventoryApi } from './api/inventory-api';

const rootReducer = combineReducers({
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [inventoryApi.reducerPath]: inventoryApi.reducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            authApi.middleware,
            inventoryApi.middleware,
        ]),
});

export type IRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
