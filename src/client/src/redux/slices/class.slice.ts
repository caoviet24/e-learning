import { createSlice } from '@reduxjs/toolkit';
import { IClass, IResponseList } from '@/types';

const initStateClass = {
    data: [] as IClass[],
    totalRecords: 0,
    pageNumber: 0,
    pageSize: 0,
};

export const classSlice = createSlice({
    name: 'class',
    initialState: {
        classesStore: initStateClass as IResponseList<IClass>,
        classesStoreDeleted: initStateClass as IResponseList<IClass>,
    },
    reducers: {
        setClasses: (state, action) => {
            if (state.classesStore.data && state.classesStore.data.length > 0 && action.payload.data) {
                const existingIds = new Set(state.classesStore.data.map((cls) => cls.id));
                const newRecords = action.payload.data.filter((cls: IClass) => !existingIds.has(cls.id));
                state.classesStore = {
                    ...action.payload,
                    data: [...state.classesStore.data, ...newRecords],
                };
            } else {
                state.classesStore = action.payload;
            }
        },
        setClassesDeleted: (state, action) => {
            if (state.classesStoreDeleted.data && state.classesStoreDeleted.data.length > 0 && action.payload.data) {
                const existingIds = new Set(state.classesStoreDeleted.data.map((cls) => cls.id));
                const newRecords = action.payload.data.filter((cls: IClass) => !existingIds.has(cls.id));
                state.classesStoreDeleted = {
                    ...action.payload,
                    data: [...state.classesStoreDeleted.data, ...newRecords],
                };
            } else {
                state.classesStoreDeleted = action.payload;
            }
        },
        setCreateClass: (state, action) => {
            state.classesStore.data.push(action.payload);
            state.classesStore.totalRecords += 1;
        },
        setUpdateClass: (state, action) => {
            const index = state.classesStore.data.findIndex((cls) => cls.id === action.payload.id);
            if (index !== -1) {
                state.classesStore.data[index] = action.payload;
            }
        },
        setDeleteSoftClass: (state, action) => {
            state.classesStore.data = state.classesStore.data.filter((cls) => cls.id !== action.payload?.id);
            state.classesStore.totalRecords -= 1;
            if (action.payload) {
                state.classesStoreDeleted.data.push(action.payload);
                state.classesStoreDeleted.totalRecords += 1;
            }
        },
        setRestoreClass: (state, action) => {
            const index = state.classesStoreDeleted.data.findIndex((cls) => cls.id === action.payload.id);
            
            if (index !== -1) {
                const restoredClass = state.classesStoreDeleted.data[index];
                state.classesStore.data.push(restoredClass);
                state.classesStoreDeleted.data.splice(index, 1);
            }
            state.classesStore.totalRecords += 1;
            state.classesStoreDeleted.totalRecords -= 1;
        },
    },
});

export const { 
    setClasses, 
    setClassesDeleted, 
    setCreateClass, 
    setUpdateClass, 
    setDeleteSoftClass, 
    setRestoreClass 
} = classSlice.actions;

export const classReducer = classSlice.reducer;