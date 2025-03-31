import { createSlice } from '@reduxjs/toolkit';
import { ILecturer } from '@/types/models';

interface LecturerState {
    lecturers: ILecturer[];
}

const initialState: LecturerState = {
    lecturers: [],
};

const lecturerSlice = createSlice({
    name: 'lecturer',
    initialState,
    reducers: {
        setLecturers: (state, action) => {
            state.lecturers = action.payload;
        },
        setCreateLecturer: (state, action) => {
            state.lecturers = [...state.lecturers, action.payload];
        },
        setDeleteSoftLecturer: (state, action) => {
            state.lecturers = state.lecturers.filter((lecturer) => lecturer.id !== action.payload);
        },
    },
});

export const { setLecturers, setCreateLecturer, setDeleteSoftLecturer } = lecturerSlice.actions;
export const lecturerReducer = lecturerSlice.reducer;