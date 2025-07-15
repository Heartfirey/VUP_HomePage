// src/store/liveRecordSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { liveRecordAPI } from '../services/API/backend/liveRecord';

// Load initial week's live data
export const loadInitialWeekRecords = createAsyncThunk(
    'liveRecord/loadInitialWeek',
    async (_, { rejectWithValue }) => {
        try {
            // 1. Get the first week's live event list
            const weekResponse = await liveRecordAPI.getWeeklyLiveEvents(0);
            const events = weekResponse.data.events;
            
            // 2. 并行获取每个事件的详细信息
            const detailsPromises = events.map(event => 
                liveRecordAPI.getLiveDetails(event.id)
            );
            const detailsResponses = await Promise.all(detailsPromises);
            
            // 3. 合并事件基础信息和详细信息
            const records = detailsResponses.map(response => response.data);
            
            return {
                records,
                weekInfo: {
                    weekOffset: weekResponse.data.weekOffset,
                    weekStart: weekResponse.data.weekStart,
                    weekEnd: weekResponse.data.weekEnd
                }
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 加载更多周的直播数据
export const loadMoreWeekRecords = createAsyncThunk(
    'liveRecord/loadMoreWeek',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const nextWeekOffset = state.liveRecord.currentWeekOffset + 1;
            
            // 1. 获取下一周的直播事件列表
            const weekResponse = await liveRecordAPI.getWeeklyLiveEvents(nextWeekOffset);
            const events = weekResponse.data.events;
            
            // 2. 如果没有事件，返回空结果
            if (events.length === 0) {
                return {
                    records: [],
                    weekInfo: {
                        weekOffset: nextWeekOffset,
                        weekStart: weekResponse.data.weekStart,
                        weekEnd: weekResponse.data.weekEnd
                    },
                    hasMore: false
                };
            }
            
            // 3. 并行获取每个事件的详细信息
            const detailsPromises = events.map(event => 
                liveRecordAPI.getLiveDetails(event.id)
            );
            const detailsResponses = await Promise.all(detailsPromises);
            
            // 4. 合并事件基础信息和详细信息
            const records = detailsResponses.map(response => response.data);
            
            return {
                records,
                weekInfo: {
                    weekOffset: nextWeekOffset,
                    weekStart: weekResponse.data.weekStart,
                    weekEnd: weekResponse.data.weekEnd
                },
                hasMore: records.length > 0 // 如果有记录说明可能还有更多
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 搜索直播记录
export const searchRecords = createAsyncThunk(
    'liveRecord/search',
    async (keyword, { rejectWithValue }) => {
        try {
            const response = await liveRecordAPI.searchLiveEvents(keyword, 0, 20);
            return {
                records: response.data.events,
                keyword,
                total: response.data.total
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const liveRecordSlice = createSlice({
    name: 'liveRecord',
    initialState: {
        records: [], // 所有已加载的录播记录
        weeklyData: [], // 按周组织的数据结构
        loading: false,
        error: null,
        hasMore: true, // 是否还有更多周可以加载
        initialized: false,
        currentWeekOffset: -1, // 当前加载到第几周（0表示本周，1表示上周）
        searchKeyword: '',
        searchResults: [],
        isSearching: false,
        searchLoading: false
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSearch: (state) => {
            state.searchKeyword = '';
            state.searchResults = [];
            state.isSearching = false;
        },
        setSearchKeyword: (state, action) => {
            state.searchKeyword = action.payload;
            state.isSearching = !!action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // 初始加载
            .addCase(loadInitialWeekRecords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadInitialWeekRecords.fulfilled, (state, action) => {
                state.loading = false;
                state.records = action.payload.records;
                state.weeklyData = [action.payload];
                state.currentWeekOffset = 0;
                state.initialized = true;
                state.hasMore = action.payload.records.length > 0;
            })
            .addCase(loadInitialWeekRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.initialized = true;
            })
            // 加载更多周
            .addCase(loadMoreWeekRecords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadMoreWeekRecords.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.records.length > 0) {
                    state.records.push(...action.payload.records);
                    state.weeklyData.push(action.payload);
                }
                state.currentWeekOffset = action.payload.weekInfo.weekOffset;
                state.hasMore = action.payload.hasMore !== false;
            })
            .addCase(loadMoreWeekRecords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // 搜索
            .addCase(searchRecords.pending, (state) => {
                state.searchLoading = true;
                state.error = null;
            })
            .addCase(searchRecords.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload.records;
                state.searchKeyword = action.payload.keyword;
                state.isSearching = true;
            })
            .addCase(searchRecords.rejected, (state, action) => {
                state.searchLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearSearch, setSearchKeyword } = liveRecordSlice.actions;
export default liveRecordSlice.reducer;
