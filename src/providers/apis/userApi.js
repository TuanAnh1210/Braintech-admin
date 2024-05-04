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
                console.log(payload);
                return { url: '/user/auth', method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useAuthUserMutation, useGetUsersQuery } = userApi;
