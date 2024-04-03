import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { configureStore } from '@reduxjs/toolkit';

import { sttCourseApi } from './apis/sttCourseApi';
import { courseApi } from './apis/courseApi';
import { userApi } from './apis/userApi';
import { billApi } from './apis/billApi';
import { cateApi } from './apis/cateApi';
import { quizzApi } from './apis/quizzApi';
import courseReducer from './slices/courseSlice';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [cateApi.reducerPath]: cateApi.reducer,
        [quizzApi.reducerPath]: quizzApi.reducer,
        [billApi.reducerPath]: billApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            cateApi.middleware,
            quizzApi.middleware,
            userApi.middleware,
            sttCourseApi.middleware,
            billApi.middleware,
        ),
});

setupListeners(store.dispatch);
