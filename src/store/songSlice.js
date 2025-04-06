import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSongList, getSongListByName, getSongListById } from '../services/songApi';



export const fetchCandidatesByName = createAsyncThunk(
    'song/fetchCandidatesByName',
    async ({ songName, pageNum, pageSize }, { rejectWithValue }) => {
        try {
            const response = await getSongListByName(songName, pageNum, pageSize);
            const { list } = response.data;
            return list;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSongsByType = createAsyncThunk(
    'song/fetchSongsByType',
    async ({ songType, pageNum, pageSize }, { rejectWithValue }) => {
        try {
            const response = await getSongList(songType, pageNum, pageSize);
            const { list, pageNum: currentPage } = response.data;
            return { songs: list, pageNum: currentPage };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSongsById = createAsyncThunk(
    'song/fetchSongsById',
    async ({ songId, pageNum, pageSize }, { rejectWithValue }) => {
        try {
            const response = await getSongListById(songId, pageNum, pageSize);
            const { list, pageNum: currentPage } = response.data;
            return { songs: list, pageNum: currentPage };
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
        persistentMode: "",
        persistentKeyword: "",
        songs: [],
        pageNum: 1,
        pageSize: 20,
        loading: false,
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
        },
        incrementPage(state) {
            state.pageNum += 1;
        },
        resetSongs(state) {
            state.songs = [];
            state.pageNum = 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidatesByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCandidatesByName.fulfilled, (state, action) => {
                state.loading = false;
                state.candidateSuggestions = action.payload;
            })
            .addCase(fetchCandidatesByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // 按钮检索更新 table
        builder
            .addCase(fetchSongsByType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSongsByType.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.pageNum === 1) {
                    state.songs = action.payload.songs;
                } else {
                    state.songs = [...state.songs, ...action.payload.songs];
                }
            })
            .addCase(fetchSongsByType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // 候选项检索更新 table
        builder
            .addCase(fetchSongsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSongsById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.pageNum === 1) {
                    state.songs = action.payload.songs;
                } else {
                    state.songs = [...state.songs, ...action.payload.songs];
                }
            })
            .addCase(fetchSongsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSearchQuery, setPersistentSearch, incrementPage, resetSongs } = songSlice.actions;
export default songSlice.reducer;
