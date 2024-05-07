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
        getTeachers: build.query({
            query: () => '/user/teachers'
        }),
        deleteuser: build.query({
            query: (id) => {
                return { url: `/user/delete/${id}`, method: 'DELETE' }
            }
        }),
        updateRole: build.query({
            query: (payload) => {
                return { url: `/user/update/${payload._id}`, method: 'PUT', body: payload }
            }
        })

    }),
});

export const { useAuthUserMutation, useGetUsersQuery, useGetTeachersQuery, useDeleteuserQuery, useUpdateRoleQuery } = userApi;
