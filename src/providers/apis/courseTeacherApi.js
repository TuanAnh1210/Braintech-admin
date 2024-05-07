import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseTeacherApi = createApi({
    reducerPath: 'courseTeacherApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api/courses_teacher' }),
    endpoints: (build) => ({
        getStudents: build.query({
            query: (teacherId) => {
                return `/all/student?teacherId=${teacherId}`;
            },
            transformResponse: (response) => {
                return response.courses;
            },
        }),
        getCourses: build.query({
            query: (teacherId) => {
                return `/all?teacherId=${teacherId}`;
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
    useGetStudentsQuery,
    useGetCoursesQuery,
    useGetCourseByIdQuery,
    useUploadImageMutation,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
} = courseTeacherApi;
