import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cateApi = createApi({
    reducerPath: 'cateApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getCate: build.query({
            query: () => {
                return '/categories';
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
    }),
});

export const { useGetCateQuery } = cateApi;
