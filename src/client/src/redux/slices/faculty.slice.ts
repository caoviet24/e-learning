import { IFaculty, IResponseList } from '@/types';
import { createSlice } from '@reduxjs/toolkit';



const initStateFaculty = {
    data: [] as IFaculty[],
    total_records: 0,
    page_number: 0,
    page_size: 0,
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
            state.facultiesStore.total_records += 1;
        },
        setUpdateFaculty: (state, action) => {
            const index = state.facultiesStore.data.findIndex((faculty) => faculty.id === action.payload.id);

            console.log('index', index);
            
            state.facultiesStore.data[index] = action.payload;
        },
        setDeleteSoftFaculty: (state, action) => {
            state.facultiesStore.data = state.facultiesStore.data.filter((faculty) => faculty.id !== action.payload?.id);
            state.facultiesStore.total_records -= 1;
            state.facultiesStoreDeleted.data.push(action.payload);
            state.facultiesStoreDeleted.total_records += 1;
        },

        setRestoreFaculty: (state, action) => {
            const index = state.facultiesStoreDeleted.data.findIndex((faculty) => faculty.id === action.payload.id);
            if (index !== -1) {
                const restoredFaculty = state.facultiesStoreDeleted.data[index];
                state.facultiesStore.data.push(restoredFaculty);
                state.facultiesStoreDeleted.data.splice(index, 1);
            }
            state.facultiesStore.total_records += 1;
            state.facultiesStoreDeleted.total_records -= 1;
        },
    },
});

export const { setFaculties, setFacultiesDeleted, setCreateFaculty, setUpdateFaculty, setDeleteSoftFaculty, setRestoreFaculty } = facultySlice.actions;

export const facultyReducer = facultySlice.reducer;
