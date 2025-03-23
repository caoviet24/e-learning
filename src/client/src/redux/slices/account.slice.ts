
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    my_account: {} as IAccount,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setMyAcount: (state, action) => {
            state.my_account = action.payload;
        },
    },
});

export const { setMyAcount } = accountSlice.actions;
export const accountReducer = accountSlice.reducer;