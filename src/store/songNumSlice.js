import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSongNum } from '../services/songApi';

export const fetchSongNum = createAsyncThunk('song/fetchSongNum', async () => {
    const response = await getSongNum();
    return response.data;
});

const songNumSlice = createSlice({
    name: 'song',
    initialState: {
        songNum: 0,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSongNum.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSongNum.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.songNum = action.payload;
            })
            .addCase(fetchSongNum.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default songNumSlice.reducer;
