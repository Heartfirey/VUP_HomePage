import { configureStore } from '@reduxjs/toolkit';
import songNumReducer from './songNumSlice';
import songReducer from './songSlice';

const store = configureStore({
    reducer: {
        songNum: songNumReducer,
        song: songReducer,
    },
});

export default store;
