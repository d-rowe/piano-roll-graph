import {configureStore} from '@reduxjs/toolkit';
import {scoreReducer} from '../features/scoreSlice';


export const store = configureStore({
    reducer: {
        score: scoreReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
