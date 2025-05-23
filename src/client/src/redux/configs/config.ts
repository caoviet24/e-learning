import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import storageSession from 'redux-persist/lib/storage/session';
import createIndexedDBStorage from 'redux-persist-indexeddb-storage';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'universal-cookie';

import { accountReducer } from '../slices/account.slice';
import { facultyReducer } from '../slices/faculty.slice';
import { majorReducer } from '../slices/major.slice';
import { lecturerReducer } from '../slices/lecturer.slice';
import { classReducer } from '../slices/class.slice';

// Tạo reducer mặc định nếu không có reducer nào khác
const defaultReducer = (state = {}) => state;

const cookies = new Cookies();

const localStorageConfig = {
    storage,
};

const sessionStorageConfig = {
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
    faculty: persistReducer({ ...localStorageConfig, key: 'faculty' }, facultyReducer),
    major: persistReducer({ ...localStorageConfig, key: 'major' }, majorReducer),
    lecturer: persistReducer({ ...localStorageConfig, key: 'lecturer' }, lecturerReducer),
    class: persistReducer({ ...localStorageConfig, key: 'class' }, classReducer),
});

export const sessionStorageReducer = combineReducers({
    default: defaultReducer,
});

export const indexedDBReducer = combineReducers({
    default: defaultReducer,
});

export const cookieStorageReducer = combineReducers({
    default: defaultReducer,
});


export const rootReducer = combineReducers({
    localStorage: localStorageReducer,
    sessionStorage: sessionStorageReducer,
    indexedDB: indexedDBReducer,
    cookieStorage: cookieStorageReducer,
});
