import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const billApi = createApi({
    reducerPath: 'billApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getBills: build.query({
            query: () => '/bills',
        }),
    }),
});

export const { useGetBillsQuery } = billApi;