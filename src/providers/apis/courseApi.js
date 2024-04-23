import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseApi = createApi({
    reducerPath: 'courseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/courses' }),
    endpoints: (build) => ({
        getCourses: build.query({
            query: () => {
                return '/all';
            },
            transformResponse: (response) => {
                return response.courses;
            },
        }),
        getCourseById: build.query({
            query: (_id) => {
                return `/${_id}`;
            },
            transformResponse: (response) => {
                return response.course;
            },
        }),
        createCourse: build.mutation({
            query: (payload) => {
                return { url: '/create', method: 'POST', body: payload };
            },
        }),
        updateCourse: build.mutation({
            query: ({ _id, ...payload }) => {
                return { url: `/${_id}/update`, method: 'PUT', body: payload };
            },
        }),
        deleteCourse: build.mutation({
            query: (payload) => {
                return { url: `/${payload._id}/delete`, method: 'DELETE' };
            },
        }),
        uploadImage: build.mutation({
            query: (payload) => {
                return { url: '/upload', method: 'POST', body: payload };
            },
        }),
    }),
});

export const {
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useUploadImageMutation,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} = courseApi;
