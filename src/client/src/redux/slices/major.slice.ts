import { createSlice } from '@reduxjs/toolkit';
import { IMajor, IResponseList } from '@/types';

const initStateMajor = {
    data: [] as IMajor[],
    totalCount: 0,
    pageNumber: 0,
    pageSize: 0,
};

export const majorSlice = createSlice({
    name: 'major',
    initialState: {
        majorsStore: initStateMajor as IResponseList<IMajor>,
        majorsStoreDeleted: initStateMajor as IResponseList<IMajor>,
    },
    reducers: {
        setMajors: (state, action) => {
            // When filtering (e.g., by facultyId) always take the API response as the source of truth
            if (action.payload.filtered) {
                state.majorsStore = action.payload;
            }
            // For regular paging/loading, merge with existing data
            else if (state.majorsStore.data && state.majorsStore.data.length > 0 && action.payload.data) {
                const existingIds = new Set(state.majorsStore.data.map((major) => major.id));
                const newRecords = action.payload.data.filter((major: IMajor) => !existingIds.has(major.id));
                state.majorsStore = {
                    ...action.payload,
                    data: [...state.majorsStore.data, ...newRecords],
                };
            } else {
                state.majorsStore = action.payload;
            }
        },
        setMajorsDeleted: (state, action) => {
            if (state.majorsStoreDeleted.data && state.majorsStoreDeleted.data.length > 0 && action.payload.data) {
                const existingIds = new Set(state.majorsStoreDeleted.data.map((major) => major.id));
                const newRecords = action.payload.data.filter((major: IMajor) => !existingIds.has(major.id));
                state.majorsStoreDeleted = {
                    ...action.payload,
                    data: [...state.majorsStoreDeleted.data, ...newRecords],
                };
            } else {
                state.majorsStoreDeleted = action.payload;
            }
        },
        setCreateMajor: (state, action) => {
            state.majorsStore.data.push(action.payload);
            state.majorsStore.totalCount += 1;
        },
        setUpdateMajor: (state, action) => {
            const index = state.majorsStore.data.findIndex((major) => major.id === action.payload.id);
            if (index !== -1) {
                state.majorsStore.data[index] = action.payload;
            }
        },
        setDeleteMajor: (state, action) => {
            state.majorsStoreDeleted.data = state.majorsStoreDeleted.data.filter((major) => major.id !== action.payload?.id);
            state.majorsStoreDeleted.totalCount -= 1;
        },

        setDeleteSoftMajor: (state, action) => {
            state.majorsStore.data = state.majorsStore.data.filter((major) => major.id !== action.payload?.id);
            state.majorsStore.totalCount -= 1;
            if (action.payload) {
                state.majorsStoreDeleted.data.push(action.payload);
                state.majorsStoreDeleted.totalCount += 1;
            }
        },
        setRestoreMajor: (state, action) => {
            const index = state.majorsStoreDeleted.data.findIndex((major) => major.id === action.payload.id);
            if (index !== -1) {
                const restoredMajor = state.majorsStoreDeleted.data[index];
                state.majorsStore.data.push(restoredMajor);
                state.majorsStoreDeleted.data.splice(index, 1);
            }
            state.majorsStore.totalCount += 1;
            state.majorsStoreDeleted.totalCount -= 1;
        },
    },
});

export const {
    setMajors,
    setMajorsDeleted,
    setCreateMajor,
    setUpdateMajor,
    setDeleteMajor,
    setDeleteSoftMajor,
    setRestoreMajor
} = majorSlice.actions;

export const majorReducer = majorSlice.reducer;