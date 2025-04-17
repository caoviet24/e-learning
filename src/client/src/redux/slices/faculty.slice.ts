import { IFaculty, IResponseList } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const initStateFaculty = {
    data: [] as IFaculty[],
    totalRecords: 0,
    pageNumber: 0,
    pageSize: 0,
};

export const facultySlice = createSlice({
    name: 'faculty',
    initialState: {
        facultiesStore: initStateFaculty as IResponseList<IFaculty>,
        facultiesStoreDeleted: initStateFaculty as IResponseList<IFaculty>,
    },
    reducers: {
        setFaculties: (state, action) => {
            if (state.facultiesStore.data && state.facultiesStore.data.length > 0 && action.payload.data) {
                const existingIds = new Set(state.facultiesStore.data.map((faculty) => faculty.id));
                const newRecords = action.payload.data.filter((faculty: IFaculty) => !existingIds.has(faculty.id));
                state.facultiesStore = {
                    ...action.payload,
                    data: [...state.facultiesStore.data, ...newRecords],
                };
            } else {
                state.facultiesStore = action.payload;
            }
        },
        setFacultiesDeleted: (state, action) => {
            if (state.facultiesStoreDeleted.data && state.facultiesStoreDeleted.data.length > 0 && action.payload.data) {
                const existingIds = new Set(state.facultiesStoreDeleted.data.map((faculty) => faculty.id));
                const newRecords = action.payload.data.filter((faculty: IFaculty) => !existingIds.has(faculty.id));
                state.facultiesStoreDeleted = {
                    ...action.payload,
                    data: [...state.facultiesStoreDeleted.data, ...newRecords],
                };
            } else {
                state.facultiesStoreDeleted = action.payload;
            }
        },
        setCreateFaculty: (state, action) => {
            state.facultiesStore.data.push(action.payload);
            state.facultiesStore.totalRecords += 1;
        },
        setUpdateFaculty: (state, action) => {
            const index = state.facultiesStore.data.findIndex((faculty) => faculty.id === action.payload.id);

            console.log('index', index);

            state.facultiesStore.data[index] = action.payload;
        },

        setDeleteSoftFaculty: (state, action) => {
            state.facultiesStore.data = state.facultiesStore.data.filter((faculty) => faculty.id !== action.payload?.id);
            state.facultiesStore.totalRecords -= 1;
            state.facultiesStoreDeleted.data.push(action.payload);
            state.facultiesStoreDeleted.totalRecords += 1;
        },

        setDeleteFaculty: (state, action) => {
            state.facultiesStoreDeleted.data = state.facultiesStoreDeleted.data.filter((faculty) => faculty.id !== action.payload?.id);
            state.facultiesStoreDeleted.totalRecords -= 1;
        },

        setRestoreFaculty: (state, action) => {
            const index = state.facultiesStoreDeleted.data.findIndex((faculty) => faculty.id === action.payload.id);
            if (index !== -1) {
                const restoredFaculty = state.facultiesStoreDeleted.data[index];
                state.facultiesStore.data.push(restoredFaculty);
                state.facultiesStoreDeleted.data.splice(index, 1);
            }
            state.facultiesStore.totalRecords += 1;
            state.facultiesStoreDeleted.totalRecords -= 1;
        },
    },
});

export const { setFaculties, setFacultiesDeleted, setCreateFaculty, setUpdateFaculty, setDeleteSoftFaculty, setRestoreFaculty, setDeleteFaculty } =
    facultySlice.actions;

export const facultyReducer = facultySlice.reducer;
