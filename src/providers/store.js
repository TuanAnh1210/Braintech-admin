import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { configureStore } from '@reduxjs/toolkit';

import { sttCourseApi } from './apis/sttCourseApi';
import { courseApi } from './apis/courseApi';
import { userApi } from './apis/userApi';
import { billApi } from './apis/billApi';
import { cateApi } from './apis/cateApi';
import { quizzApi } from './apis/quizzApi';
import { lessonApi } from './apis/lessonApi';
import courseReducer from './slices/courseSlice';
import { chapterApi } from './apis/chapterApi';
import { voucherApi } from './apis/voucherApi';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [cateApi.reducerPath]: cateApi.reducer,
        [quizzApi.reducerPath]: quizzApi.reducer,
        [lessonApi.reducerPath]: lessonApi.reducer,
        [chapterApi.reducerPath]: chapterApi.reducer,
        [billApi.reducerPath]: billApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
        [voucherApi.reducerPath]: voucherApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            cateApi.middleware,
            quizzApi.middleware,
            lessonApi.middleware,
            userApi.middleware,
            chapterApi.middleware,
            sttCourseApi.middleware,
            billApi.middleware,
            voucherApi.middleware,
        ),
});

setupListeners(store.dispatch);
