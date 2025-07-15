// src/features/scheduleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWeeks } from '../services/API/backend/scheduleApi';
import config from '../config';

// Load initial week data
export const loadInitialSchedules = createAsyncThunk(
    'schedule/loadInitial',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getWeeks(0);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const loadMoreSchedules = createAsyncThunk(
    'schedule/loadMore',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            // Use page number as offset, return rowPerPage items per page
            const nextPage = state.schedule.currentPage + 1;
            const data = await getWeeks(nextPage);
            return { data, page: nextPage };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const scheduleSlice = createSlice({
    name: 'schedule',
    initialState: {
        weekList: [], // Initially empty array, loaded from backend
        loading: false,
        error: null,
        hasMore: true, // Whether there is more data to load
        initialized: false, // Whether initialized
        currentPage: 0, // Current page loaded
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Initial loading
            .addCase(loadInitialSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadInitialSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.weekList = action.payload;
                state.initialized = true;
                state.currentPage = 0;
                state.hasMore = action.payload.length >= config.scheduleStyle.rowPerPage;
            })
            .addCase(loadInitialSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.initialized = true;
            })
            // Load more
            .addCase(loadMoreSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadMoreSchedules.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data.length > 0) {
                    state.weekList.push(...action.payload.data);
                    state.currentPage = action.payload.page;
                    // If returned data is less than rowPerPage, there's no more data
                    state.hasMore = action.payload.data.length >= config.scheduleStyle.rowPerPage;
                } else {
                    state.hasMore = false; // No more data
                }
            })
            .addCase(loadMoreSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = scheduleSlice.actions;
export default scheduleSlice.reducer;
