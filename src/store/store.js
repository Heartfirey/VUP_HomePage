import { configureStore } from '@reduxjs/toolkit';
import songNumReducer from './songNumSlice';
import songReducer from './songSlice';
import bilibiliLiveReducer from './bilibiliLiveSlice';
import cardSwitcherReducer from './cardSwitcherSlice';

const store = configureStore({
    reducer: {
        songNum: songNumReducer,
        song: songReducer,
        bilibiliLive: bilibiliLiveReducer,
        cardSwitcher: cardSwitcherReducer,
    },
});

export default store;
