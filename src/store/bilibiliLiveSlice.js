import config from '../config';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRoomInfo, getAnchorInfo } from '../services/API/backend/bilibiliApi';

export const fetchRoomInfo = createAsyncThunk(
    'bilibiliLive/fetchRoomInfo',
    async () => {
        const response = await getRoomInfo(config.anchorInfo.roomId);
        return response.data;
    }
)

export const fetchAnchorInfo = createAsyncThunk(
    'bilibiliLive/fetchAnchorInfo',
    async () => {
        const response = await getAnchorInfo(config.anchorInfo.roomId);
        return response.data;
    }
)

const liveSlice = createSlice({
    name: 'bilibiliLiveInfo',
    initialState: {
        roomInfo: null,
        anchorInfo: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomInfo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRoomInfo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.roomInfo = action.payload;
            })
            .addCase(fetchRoomInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
        builder
            .addCase(fetchAnchorInfo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnchorInfo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.anchorInfo = action.payload;
            })
            .addCase(fetchAnchorInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
})

export default liveSlice.reducer;
