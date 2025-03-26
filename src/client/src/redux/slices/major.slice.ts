import { createSlice } from '@reduxjs/toolkit';
import { IMajor } from '@/types/models';

interface MajorState {
    majors: IMajor[];
}

const initialState: MajorState = {
    majors: [],
};

const majorSlice = createSlice({
    name: 'major',
    initialState,
    reducers: {
        setMajors: (state, action) => {
            state.majors = action.payload;
        },
        setCreateMajor: (state, action) => {
            state.majors = [...state.majors, action.payload];
        },
        setDeleteSoftMajor: (state, action) => {
            state.majors = state.majors.filter((major) => major.id !== action.payload);
        },
    },
});

export const { setMajors, setCreateMajor, setDeleteSoftMajor } = majorSlice.actions;
export const majorReducer = majorSlice.reducer;