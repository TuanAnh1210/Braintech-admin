import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const billApi = createApi({
    reducerPath: 'billApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getBills: build.query({
            query: (timestamp) => {
                return { url: `/payment`, params: { ...timestamp }, method: 'GET' };
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
        getBillById: build.query({
            query: (id) => `/payment/${id}`,
        }),
    }),
});

export const { useGetBillsQuery, useGetBillByIdQuery } = billApi;
