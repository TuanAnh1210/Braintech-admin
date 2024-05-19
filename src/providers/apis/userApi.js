import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api',
        prepareHeaders: (headers) => {
            const token = cookies.get('cookieLoginStudent'); // Lấy giá trị token từ cookie

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('Authorization', `Bearer ${token.accessToken}`);
            }

            return headers;
        },
    }),

    endpoints: (build) => ({
        getUsers: build.query({
            query: () => '/user',
        }),
        authUser: build.mutation({
            query: (payload) => {
                return { url: '/user/auth', method: 'POST', body: payload };
            },
        }),
        getUser: build.query({
            query: () => {
                return `/user/get`;
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
        getUserById: build.query({
            query: (userId) => {
                return `/user/${userId}`;
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
        getTeachers: build.query({
            query: () => '/user/teachers',
        }),
        deleteuser: build.query({
            query: (id) => {
                return { url: `/user/delete/${id}`, method: 'DELETE' };
            },
        }),
        updateRole: build.query({
            query: (payload) => {
                return { url: `/user/update/${payload._id}`, method: 'PUT', body: payload };
            },
        }),
        updateCourseId: build.query({
            query: (payload) => {
                return { url: `/user/updatecourse/${payload.id}`, method: 'PUT', body: payload };
            },
        }),
        updateUser: build.mutation({
            query: ({ userId, ...payload }) => {
                return { url: `/user/${userId}/updateVoucher`, method: 'PATCH', body: payload };
            },
        }),
        removeExpiredVouchers: build.mutation({
            query: (payload) => {
                return { url: `/user/removeExpiredVouchers`, method: 'PATCH', body: payload };
            },
        }),
    }),
});

export const {
    useAuthUserMutation,
    useDeleteuserQuery,
    useGetUserByIdQuery,
    useUpdateCourseIdQuery,
    useUpdateRoleQuery,
    useUpdateUserMutation,
    useGetTeachersQuery,
    useGetUsersQuery,
    useGetUserQuery,
    useRemoveExpiredVouchersMutation,
} = userApi;
