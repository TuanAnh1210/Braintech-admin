import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api' }),
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
            query: (_id) => {
                return `/user/${_id}`;
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
                return { url: `/user/${userId}/update`, method: 'PATCH', body: payload };
            },
        }),
    }),
});

export const {
    useAuthUserMutation,
    useDeleteuserQuery,
    useGetUserQuery,
    useGetUsersQuery,
    useUpdateCourseIdQuery,
    useUpdateRoleQuery,
    useUpdateUserMutation,
    useGetTeachersQuery,
} = userApi;
