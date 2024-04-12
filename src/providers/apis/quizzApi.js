import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizzApi = createApi({
    reducerPath: 'quizzApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/quizzs' }),
    endpoints: (build) => ({
        getQuizzsByLessonId: build.query({
            query: (lessonId) => {
                return `/${lessonId}/all`;
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
        createQuizzs: build.mutation({
            query: (payload) => {
                return { url: '/create', method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useCreateQuizzsMutation, useGetQuizzsByLessonIdQuery } = quizzApi;
