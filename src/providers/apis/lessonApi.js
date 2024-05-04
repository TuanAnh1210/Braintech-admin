import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const lessonApi = createApi({
    reducerPath: 'lessonApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api/lessons' }),
    endpoints: (build) => ({
        createLesson: build.mutation({
            query: (payload) => {
                return { url: `/create`, method: 'POST', body: payload };
            },
        }),
        updateLessonById: build.mutation({
            query: ({ lessonId, ...payload }) => {
                return { url: `/${lessonId}/update`, method: 'PUT', body: payload };
            },
        }),
    }),
});

export const { useUpdateLessonByIdMutation, useCreateLessonMutation } = lessonApi;
