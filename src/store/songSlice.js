import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSongListByKey, getSuperSongList, getSongByKeyword } from '../services/API/backend/songApi';


export const fetchSongsByKeyValue = createAsyncThunk(
    'song/fetchSongsByKeyValue',
    async ({ key, value, pageNum, pageSize }, { rejectWithValue }) => {
        try {
            // Compatibility for backend API
            if (key === 'isSuper') {
                const response = await getSuperSongList(pageNum, pageSize);
                return { songs: response.data.list, pageNum };
            }
            // End of compatibility code
            const response = await getSongListByKey(key, value, pageNum, pageSize);
            const { list, pageNum: currentPage } = response.data;
            return { songs: list, pageNum: currentPage };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const fetchCandidatesByName = createAsyncThunk(
    'song/fetchCandidatesByName',
    async ({ localQuery, pageNum, pageSize }, { rejectWithValue }) => {
        try {
            console.log("Fetching candidates for song name:", localQuery);
            const response = await getSongByKeyword(localQuery);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSongsByBlur = createAsyncThunk(
    'song/fetchSongsByBlur',
    async ({ keyword, pageNum, pageSize }, { rejectWithValue }) => {
        try {
            console.log("Fetching songs by blur search:", keyword);
            const response = await getSongByKeyword(keyword);
            return { songs: response.data, pageNum };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const songSlice = createSlice({
    name: 'song',
    initialState: {
        searchQuery: "",
        candidateSuggestions: [],
        candidatesLoading: false, // 独立的候选建议加载状态
        persistentMode: "",
        persistentKeyword: "",
        songs: [],
        pageNum: 1,
        pageSize: 20,
        loading: false,
        hasMore: true,
        error: null,
    },
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setPersistentSearch(state, action) {
            state.persistentMode = action.payload.mode;
            state.persistentKeyword = action.payload.keyword;
            state.pageNum = 1;
            state.songs = [];
            state.candidateSuggestions = [];
            state.hasMore = true;
        },
        setPageSize(state, action) {
            state.pageSize = action.payload;
        },
        incrementPage(state) {
            state.pageNum += 1;
        },
        resetSongs(state) {
            state.songs = [];
            state.pageNum = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSongsByKeyValue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSongsByKeyValue.fulfilled, (state, action) => {
                state.loading = false;
                state.pageNum = action.payload.pageNum;
                const newSongs = action.payload.songs;
                
                if (action.payload.pageNum === 1) {
                    state.songs = newSongs;
                } else {
                    state.songs = [...state.songs, ...newSongs];
                }
                
                // 判断是否还有更多数据：如果返回的数据量少于pageSize，说明没有更多数据了
                state.hasMore = newSongs.length >= state.pageSize;
            })
            .addCase(fetchSongsByKeyValue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        builder
            .addCase(fetchCandidatesByName.pending, (state) => {
                state.candidatesLoading = true; // 使用独立的loading状态
            })
            .addCase(fetchCandidatesByName.fulfilled, (state, action) => {
                state.candidatesLoading = false;
                state.candidateSuggestions = action.payload;
            })
            .addCase(fetchCandidatesByName.rejected, (state, action) => {
                state.candidatesLoading = false;
                state.error = action.payload;
            });
        builder
            .addCase(fetchSongsByBlur.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSongsByBlur.fulfilled, (state, action) => {
                state.loading = false;
                state.pageNum = action.payload.pageNum;
                const newSongs = action.payload.songs;
                
                if (action.payload.pageNum === 1) {
                    state.songs = newSongs;
                } else {
                    state.songs = [...state.songs, ...newSongs];
                }
                
                // 模糊搜索通常是一次性的，不支持分页，所以设置hasMore为false
                state.hasMore = false;
            })
            .addCase(fetchSongsByBlur.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSearchQuery, setPersistentSearch, setPageSize, incrementPage, resetSongs } = songSlice.actions;
export default songSlice.reducer;
