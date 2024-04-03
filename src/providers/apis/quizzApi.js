import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quizzApi = createApi({
    reducerPath: 'quizzApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        createQuizzs: build.mutation({
            query: (payload) => {
                return { url: '/quizzs/create', method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useCreateQuizzsMutation } = quizzApi;
