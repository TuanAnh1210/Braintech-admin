import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    courses: [],
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        addCourse: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

const courseReducer = courseSlice.reducer;

export default courseReducer;
