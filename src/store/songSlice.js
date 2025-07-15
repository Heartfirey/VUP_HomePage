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
            .addCase(fetchSongsByKeyValue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSongsByKeyValue.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.pageNum === 1) {
                    state.songs = action.payload.songs;
                } else {
                    state.songs = [...state.songs, ...action.payload.songs];
                }
            })
            .addCase(fetchSongsByKeyValue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
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
    }
});

export const { setSearchQuery, setPersistentSearch, incrementPage, resetSongs } = songSlice.actions;
export default songSlice.reducer;
