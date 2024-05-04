import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cateApi = createApi({
    reducerPath: 'cateApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api' }),
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
