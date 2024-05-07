import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { configureStore } from '@reduxjs/toolkit';

import { sttCourseApi } from './apis/sttCourseApi';
import { courseApi } from './apis/courseApi';
import { courseTeacherApi } from './apis/courseTeacherApi';
import { userApi } from './apis/userApi';
import { billApi } from './apis/billApi';
import { cateApi } from './apis/cateApi';
import { quizzApi } from './apis/quizzApi';
import { lessonApi } from './apis/lessonApi';
import courseReducer from './slices/courseSlice';
import { chapterApi } from './apis/chapterApi';
import { chapterTeacherApi } from './apis/chapterTeacherApi';
import { rateApi } from './apis/rateApi';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [courseTeacherApi.reducerPath]: courseTeacherApi.reducer,
        [cateApi.reducerPath]: cateApi.reducer,
        [quizzApi.reducerPath]: quizzApi.reducer,
        [lessonApi.reducerPath]: lessonApi.reducer,
        [chapterApi.reducerPath]: chapterApi.reducer,
        [chapterTeacherApi.reducerPath]: chapterTeacherApi.reducer,
        [billApi.reducerPath]: billApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
        [rateApi.reducerPath]: rateApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            courseTeacherApi.middleware,
            cateApi.middleware,
            quizzApi.middleware,
            lessonApi.middleware,
            userApi.middleware,
            chapterApi.middleware,
            chapterTeacherApi.middleware,
            sttCourseApi.middleware,
            billApi.middleware,
            rateApi.middleware,
        ),
});

setupListeners(store.dispatch);
