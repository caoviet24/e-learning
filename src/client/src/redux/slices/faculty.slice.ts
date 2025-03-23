import { createSlice } from '@reduxjs/toolkit';

export const facultySlice = createSlice({
    name: 'faculty',
    initialState: {
        faculties: [] as IFaculty[],
    },
    reducers: {
        setFaculties: (state, action) => {
            state.faculties = action.payload;
        },
        setCreateFaculty: (state, action) => {
            state.faculties.push(action.payload);
        },
        setUpdateFaculty: (state, action) => {
            const index = state.faculties.findIndex((faculty) => faculty.id === action.payload.id);
            state.faculties[index] = action.payload;
        },
        setDeleteSoftFaculty: (state, action) => {
            state.faculties = state.faculties.filter((faculty) => faculty.id !== action.payload);
        },
    },
});

export const { 
    setFaculties, setCreateFaculty, setUpdateFaculty, 
    setDeleteSoftFaculty 
} = facultySlice.actions;

export const facultyReducer = facultySlice.reducer;
