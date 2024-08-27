import { createSlice, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

interface PostUserSchema {
    _id: string,
    username: string,
    email: string
}

interface PostSchema {
    _id: string,
    user: PostUserSchema,
    postTitle: string,
    postContent: string,
}

interface LoginState {
    isLoggedIn: boolean,
    loggedInUser: {
        userId: string,
        username: string,
        email: string,
        accessToken: string,
        allPosts: Array<PostSchema>
    }
}


const initialLoginState: LoginState = {
    isLoggedIn: false,
    loggedInUser: {
        userId: "",
        username: "",
        email: "",
        accessToken: "",
        allPosts: []
    }
};


const authSlice = createSlice({
    name: 'auth',
    initialState: initialLoginState,
    reducers: {
        changeIsLoggedIn(currentState, action) {
            currentState.isLoggedIn = action.payload;
        },
        changeLoggedInUser(currentState, action) {
            currentState.loggedInUser = action.payload;
        }
    }
});


const reducers = combineReducers({
    auth: authSlice.reducer
});


const persistConfig = {
    key: 'root',
    storage
};


const persistedReducer = persistReducer(persistConfig, reducers);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
});


export const authActions = authSlice.actions;


export default store;