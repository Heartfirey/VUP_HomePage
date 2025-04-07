import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    InputBase,
    IconButton,
    CardContent,
    Popper,
    List,
    ListItem,
    ListItemText,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RawBlurCard from './RawBlurCard';
import FrostedButton from './FrostedButton';
import { pink, amber } from '@mui/material/colors';
import {
    fetchSongsByKeyValue,
    fetchCandidatesByName,
    setSearchQuery,
    setPersistentSearch,
    resetSongs
} from '../store/songSlice';
import CopyToClipboardSnackbar from '../services/copyUtils';
import { getRandomSong } from '../services/songApi';

//* Icons
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import CasinoTwoToneIcon from '@mui/icons-material/CasinoTwoTone';
import DiamondTwoToneIcon from '@mui/icons-material/DiamondTwoTone';

const candidateJson = [
    { name: "国风歌曲", keyword: "国风", reqKey: "songType" },
    { name: "流行歌曲", keyword: "流行", reqKey: "songType" },
    { name: "民谣歌曲", keyword: "民谣", reqKey: "songType" },
    { name: "国语歌曲", keyword: "国语", reqKey: "language" },
    { name: "日语歌曲", keyword: "日语", reqKey: "songType" },
    { name: "粤语歌曲", keyword: "粤语", reqKey: "songType" },
    { name: "韩语歌曲", keyword: "韩语", reqKey: "songType" },
    { name: "原创歌曲", keyword: "原创", reqKey: "songType" },
    { name: "儿歌歌曲", keyword: "儿歌", reqKey: "songType" },
    { name: "全部歌曲", keyword: "", reqKey: "songType" },
]

export default function SearchCard() {
    const dispatch = useDispatch();
    const { pageSize, candidateSuggestions, } = useSelector(state => state.song);
    const [localQuery, setLocalQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPopper, setOpenPopper] = useState(false);
    const [isSuperSong, setIsSuperSong] = useState(false); 
    const copyRef = useRef();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setSearchQuery(localQuery));
            dispatch(fetchCandidatesByName({ localQuery, pageNum: 1, pageSize }));
        }, 500);
        return () => clearTimeout(timer);
    }, [localQuery, dispatch, pageSize]);

    const handleSearchClick = () => {
        console.log("Search clicked with query:", localQuery);
        if (localQuery.trim() === "") return;
        dispatch(setSearchQuery(localQuery));
        dispatch(fetchCandidatesByName({ localQuery, pageNum: 1, pageSize }));
    };

    const handleCandidateClick = (candidate) => {
        console.log("Candidate clicked:", candidate);
        dispatch(setPersistentSearch({ mode: "id", keyword: candidate.id }));
        dispatch(resetSongs());
        dispatch(fetchSongsByKeyValue({ key: 'id', value: candidate.id, pageNum: 1, pageSize }));
    };

    const handleButtonClick = (keyword, reqKey) => {
        dispatch(setPersistentSearch({ mode: "songType", keyword: keyword }));
        dispatch(resetSongs());
        dispatch(fetchSongsByKeyValue({ key: reqKey, value: keyword, pageNum: 1, pageSize }));
        setLocalQuery("");
    };

    const handleRandomSongClick = () => {
        getRandomSong().then((res) => {
            const song = res.data;
            if (copyRef.current) {
                copyRef.current.copy(song.songName);
            }
        });
    };

    const handleSuperSongClick = () => {
        if (isSuperSong) {
            console.log('请求另一个API');
            dispatch(setPersistentSearch({ mode: 'songType', keyword: '' }));
            dispatch(resetSongs());
            dispatch(fetchSongsByKeyValue({ key: 'songType', value: '', pageNum: 1, pageSize: 10 }));
        } else {
            console.log('请求现有API');
            dispatch(setPersistentSearch({ mode: 'isSuper', keyword: 1 }));
            dispatch(resetSongs());
            dispatch(fetchSongsByKeyValue({ key: 'isSuper', value: 1, pageNum: 1, pageSize: 10 }));
        }

        // 切换按钮状态
        setIsSuperSong(!isSuperSong);
    }

    return (
        <>
        <RawBlurCard className="overflow-visible">
            <CardContent className="flex flex-col justify-center space-y-4">
                <Paper
                    variant="outlined"
                    component="form"
                    className='flex flow-col justify-center items-center w-full'
                    sx={{ borderRadius: '16px' }}
                    ref={node => setAnchorEl(node)}
                >
                    <LibraryMusicTwoToneIcon className='mx-2' />
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="查找歌曲/歌手"
                        inputProps={{ 'aria-label': 'search songs' }}
                        value={localQuery}
                        onChange={(e) => {
                            setLocalQuery(e.target.value);
                        }}
                        onFocus={() => setOpenPopper(true)}
                        onBlur={() => setTimeout(() => setOpenPopper(false), 150)}
                    />
                    <IconButton
                        type="button"
                        sx={{ p: '10px' }}
                        aria-label="search"
                        onClick={handleSearchClick}
                    >
                        <SearchIcon />
                    </IconButton>
                </Paper>

                <Popper
                    open={!!(candidateSuggestions?.length && openPopper && localQuery.trim())}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    sx={{
                        width: anchorEl?.offsetWidth,
                        zIndex: 1300,
                        marginTop: '4px'
                    }}
                >
                    <Paper elevation={3} sx={{ width: '100%' }}>
                        <List dense sx={{ py: 0 }}>
                            {candidateSuggestions?.map((candidate) => (
                                <ListItem
                                    key={candidate.id}
                                    button
                                    onClick={() => handleCandidateClick(candidate)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2">
                                                {candidate.songName}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Popper>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <FrostedButton onClick={handleRandomSongClick}><CasinoTwoToneIcon /><span className="text-lg font-fold">随机歌曲</span></FrostedButton>
                    <FrostedButton onClick={handleSuperSongClick}
                    sx={{
                        backgroundColor: isSuperSong ? amber[700] : 'F2F2F7',
                        color: isSuperSong ? 'white' : amber[700],
                    }}
                    ><DiamondTwoToneIcon sx={{ color: isSuperSong ? 'white' : amber[700] }} /><span className="text-lg font-fold">SC歌曲</span></FrostedButton>
                    {candidateJson.map((btn, index) => (
                        <FrostedButton key={index} onClick={() => handleButtonClick(btn.keyword, btn.reqKey)}>
                            <span className="text-lg font-fold" style={{ color: pink[600] }}>{btn.name}</span>
                        </FrostedButton>
                    ))}
                </div>
            </CardContent>
        </RawBlurCard>
        <CopyToClipboardSnackbar ref={copyRef} />
        </>
    );
}
