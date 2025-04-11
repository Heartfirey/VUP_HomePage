import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSongListByKey, getSuperSongList } from '../services/songApi';


export const fetchSongsByKeyValue = createAsyncThunk(
    'song/fetchSongsByKeyValue',
    async ({ key, value, pageNum, pageSize }, { rejectWithValue }) => {
        try {
            // fit for fucking 雪域provealms backend API.
            if (key === 'isSuper') {
                const response = await getSuperSongList(pageNum, pageSize);
                return { songs: response.data, pageNum };
            }
            // finish fucking 雪域provealms backend API.
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
    async ({ songName, pageNum, pageSize }, { rejectWithValue }) => {
        try {
            const response = await getSongListByKey({key: 'songName', value: songName, pageNum, pageSize});
            const { list } = response.data;
            return list;
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
