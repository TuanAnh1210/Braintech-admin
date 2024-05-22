import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sttCourseApi = createApi({
    reducerPath: 'sttCourseApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api' }),
    endpoints: (build) => ({
        getSttCourse: build.query({
            query: (timestamp) => {
                return { url: `/sttCourse`, params: { ...timestamp }, method: 'GET' };
            },
        }),

        addSttCourse: build.mutation({
            query: (payload) => {
                return { url: '/sttCourse/add', method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useAddSttCourseMutation, useGetSttCourseQuery } = sttCourseApi;
