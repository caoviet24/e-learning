import { createSlice } from '@reduxjs/toolkit';
import { ILecturer, IResponseList } from '@/types';

const initStateLecturer = {
    data: [] as ILecturer[],
    totalCount: 0,
    pageNumber: 0,
    pageSize: 0,
};

export const lecturerSlice = createSlice({
    name: 'lecturer',
    initialState: {
        lecturersStore: initStateLecturer as IResponseList<ILecturer>,
        lecturersStoreDeleted: initStateLecturer as IResponseList<ILecturer>,
    },
    reducers: {
        setLecturers: (state, action) => {
            if (state.lecturersStore.data && state.lecturersStore.data.length > 0 && action.payload.data) {
                const existingIds = new Set(state.lecturersStore.data.map((lecturer) => lecturer.id));
                const newRecords = action.payload.data.filter((lecturer: ILecturer) => !existingIds.has(lecturer.id));
                state.lecturersStore = {
                    ...action.payload,
                    data: [...state.lecturersStore.data, ...newRecords],
                };
            } else {
                state.lecturersStore = action.payload;
            }
        },
        setLecturersDeleted: (state, action) => {
            if (state.lecturersStoreDeleted.data && state.lecturersStoreDeleted.data.length > 0 && action.payload.data) {
                const existingIds = new Set(state.lecturersStoreDeleted.data.map((lecturer) => lecturer.id));
                const newRecords = action.payload.data.filter((lecturer: ILecturer) => !existingIds.has(lecturer.id));
                state.lecturersStoreDeleted = {
                    ...action.payload,
                    data: [...state.lecturersStoreDeleted.data, ...newRecords],
                };
            } else {
                state.lecturersStoreDeleted = action.payload;
            }
        },
        setCreateLecturer: (state, action) => {
            state.lecturersStore.data.push(action.payload);
            state.lecturersStore.totalCount += 1;
        },
        setUpdateLecturer: (state, action) => {
            const index = state.lecturersStore.data.findIndex((lecturer) => lecturer.id === action.payload.id);
            if (index !== -1) {
                state.lecturersStore.data[index] = action.payload;
            }
        },
        setDeleteSoftLecturer: (state, action) => {
            state.lecturersStore.data = state.lecturersStore.data.filter((lecturer) => lecturer.id !== action.payload?.id);
            state.lecturersStore.totalCount -= 1;
            if (action.payload) {
                state.lecturersStoreDeleted.data.push(action.payload);
                state.lecturersStoreDeleted.totalCount += 1;
            }
        },
        setRestoreLecturer: (state, action) => {
            const index = state.lecturersStoreDeleted.data.findIndex((lecturer) => lecturer.id === action.payload.id);
            console.log('index', index);
            
            if (index !== -1) {
                const restoredLecturer = state.lecturersStoreDeleted.data[index];
                state.lecturersStore.data.push(restoredLecturer);
                state.lecturersStoreDeleted.data.splice(index, 1);
            }
            state.lecturersStore.totalCount += 1;
            state.lecturersStoreDeleted.totalCount -= 1;
        },
    },
});

export const { setLecturers, setLecturersDeleted, setCreateLecturer, setUpdateLecturer, setDeleteSoftLecturer, setRestoreLecturer } = lecturerSlice.actions;

export const lecturerReducer = lecturerSlice.reducer;
