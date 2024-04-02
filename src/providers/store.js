import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import { courseApi } from './apis/courseApi';
import { userApi } from './apis/userApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { sttCourseApi } from './apis/sttCourseApi';
import { billApi } from './apis/billApi';
import { cateApi } from './apis/cateApi';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [cateApi.reducerPath]: cateApi.reducer,
        [billApi.reducerPath]: billApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            cateApi.middleware,
            userApi.middleware,
            sttCourseApi.middleware,
            billApi.middleware,
        ),
});

setupListeners(store.dispatch);
