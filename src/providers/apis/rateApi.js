import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies(); // Create a new instance of Cookies

export const rateApi = createApi({
    reducerPath: 'rateApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api/rate',
    }),

    endpoints: (build) => ({
        getContentRating: build.query({
            query: () => {
                return '/getallrate';
            },
        }),
    }),
});
export const { useGetContentRatingQuery } = rateApi;
