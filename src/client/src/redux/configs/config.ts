import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session'; 
import createIndexedDBStorage from 'redux-persist-indexeddb-storage';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'universal-cookie';

import { accountReducer } from '../slices/account.slices';

// Tạo reducer mặc định nếu không có reducer nào khác
const defaultReducer = (state = {}) => state;

const cookies = new Cookies();

const localStorageConfig = {
    key: 'local',
    storage,
};

const sessionStorageConfig = {
    key: 'session',
    storage: storageSession,
};

const indexedDBConfig = {
    key: 'indexedDB',
    storage: createIndexedDBStorage('myDatabase'),
};

const cookiesConfig = {
    key: 'cookies',
    storage: new CookieStorage(cookies, {
        expiration: {
            default: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        },
        secure: true,
    }),
};


export const localStorageReducer = combineReducers({
    default: defaultReducer, 
});

export const sessionStorageReducer = combineReducers({
    account: persistReducer(sessionStorageConfig, accountReducer),
});

export const indexedDBReducer = combineReducers({
    default: defaultReducer, 
});

export const cookieStorageReducer = combineReducers({
    default: defaultReducer,
});

// Gộp tất cả lại thành rootReducer
export const rootReducer = combineReducers({
    localStorage: localStorageReducer,
    sessionStorage: sessionStorageReducer,
    indexedDB: indexedDBReducer,
    cookieStorage: cookieStorageReducer,
});
