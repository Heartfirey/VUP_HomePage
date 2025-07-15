import { configureStore } from '@reduxjs/toolkit';
import songNumReducer from './songNumSlice';
import songReducer from './songSlice';
import bilibiliLiveReducer from './bilibiliLiveSlice';
import cardSwitcherReducer from './cardSwitcherSlice';
import scheduleReducer from './scheduleSlice';
import liveRecordReducer from './liveRecordSlice';

// Third-party API
import { vrpApi } from '../services/API/third-party/vrp.moe';
import { cherrynovaApi } from '../services/API/third-party/cherrynova.live';

const store = configureStore({
    reducer: {
        songNum: songNumReducer,
        song: songReducer,
        bilibiliLive: bilibiliLiveReducer,
        cardSwitcher: cardSwitcherReducer,
        schedule: scheduleReducer,
        liveRecord: liveRecordReducer,
        [vrpApi.reducerPath]: vrpApi.reducer,
        [cherrynovaApi.reducerPath]: cherrynovaApi.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(vrpApi.middleware, cherrynovaApi.middleware),
});

export default store;
