import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseApi = createApi({
    reducerPath: 'courseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    // tagTypes: ['Courses', 'Upload_image'],
    endpoints: (build) => ({
        getCourses: build.query({
            query: () => {
                return '/courses/all';
            },
            transformResponse: (response) => {
                return response.courses;
            },
            // providesTags: ['Courses'],
        }),
        getCourseById: build.query({
            query: (_id) => {
                return `/courses/${_id}`;
            },
            transformResponse: (response) => {
                return response.course;
            },
        }),
        createCourse: build.mutation({
            query: (payload) => {
                return { url: '/courses/create', method: 'POST', body: payload };
            },
        }),
        updateCourse: build.mutation({
            query: ({ _id, ...payload }) => {
                return { url: `/courses/${_id}/update`, method: 'PUT', body: payload };
            },
        }),
        deleteCourse: build.mutation({
            query: (payload) => {
                return { url: `/courses/${payload._id}/delete`, method: 'DELETE' };
            },
        }),
        uploadImage: build.mutation({
            queryFn: async (payload) => {
                return { url: '/courses/upload', method: 'POST', body: payload };
            },
            // providesTags: ['Upload_image'],
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
