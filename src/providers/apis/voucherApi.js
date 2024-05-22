import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const voucherApi = createApi({
    reducerPath: 'voucherapi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api/voucher' }),
    tagTypes: ['Voucher'],
    refetchOnMountOrArgChange: 30,
    endpoints: (build) => ({
        getVoucherById: build.query({
            query: (id) => {
                return `/${id}`;
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
        createVoucher: build.mutation({
            query: (payload) => {
                return { url: '/create', method: 'POST', body: payload };
            },
            invalidatesTags: ['Voucher'],
        }),
        getAllVoucher: build.query({
            query: () => {
                return `/`;
            },
            providesTags: ['Voucher'],
        }),
        deleteVoucher: build.mutation({
            query: (payload) => {
                return { url: `/${payload._id}`, method: 'DELETE' };
            },
        }),
        updateVoucher: build.mutation({
            query: ({ voucherId, ...payload }) => {
                return { url: `/${voucherId}/update`, method: 'PATCH', body: payload };
            },
            invalidatesTags: ['Voucher'],
        }),
    }),
});

export const {
    useCreateVoucherMutation,
    useGetVoucherByIdQuery,
    useGetAllVoucherQuery,
    useDeleteVoucherMutation,
    useUpdateVoucherMutation,
} = voucherApi;
