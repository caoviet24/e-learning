
import { IAccount } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    my_account: {} as IAccount,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setMyAccount: (state, action) => {
            state.my_account = action.payload;
        },
    },
});
export const { setMyAccount } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;