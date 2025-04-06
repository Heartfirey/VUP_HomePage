import React, { useEffect, useState } from 'react';
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
    fetchCandidatesByName,
    fetchSongsByType,
    fetchSongsById,
    setSearchQuery,
    setPersistentSearch,
    resetSongs
} from '../store/songSlice';


//* Icons
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import CasinoTwoToneIcon from '@mui/icons-material/CasinoTwoTone';
import DiamondTwoToneIcon from '@mui/icons-material/DiamondTwoTone';

const candidateJson = [
    { name: "国风歌曲", keyword: "国风" },
    { name: "流行歌曲", keyword: "流行" },
    { name: "民谣歌曲", keyword: "民谣" },
    { name: "国语歌曲", keyword: "国语" },
    { name: "日语歌曲", keyword: "日语" },
    { name: "粤语歌曲", keyword: "粤语" },
    { name: "韩语歌曲", keyword: "韩语" },
    { name: "原创歌曲", keyword: "原创" },
    { name: "儿歌歌曲", keyword: "儿歌" },
    { name: "全部歌曲", keyword: "" },
]

export default function SearchCard() {
    const dispatch = useDispatch();
    const { pageSize, candidateSuggestions, } = useSelector(state => state.song);
    const [localQuery, setLocalQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPopper, setOpenPopper] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setSearchQuery(localQuery));
            dispatch(fetchCandidatesByName({ songName: localQuery, pageNum: 1, pageSize }));
        }, 500);
        return () => clearTimeout(timer);
    }, [localQuery, dispatch, pageSize]);

    const handleSearchClick = () => {
        console.log("Search clicked with query:", localQuery);
        if (localQuery.trim() === "") return;
        dispatch(setSearchQuery(localQuery));
        dispatch(fetchCandidatesByName({ songName: localQuery, pageNum: 1, pageSize }));
    };

    const handleCandidateClick = (candidate) => {
        console.log("Candidate clicked:", candidate);
        dispatch(setPersistentSearch({ mode: "id", keyword: candidate.id }));
        dispatch(resetSongs());
        dispatch(fetchSongsById({ songId: candidate.id, pageNum: 1, pageSize }));
    };

    const handleButtonClick = (keyword) => {
        dispatch(setPersistentSearch({ mode: "type", keyword: keyword }));
        dispatch(resetSongs());
        dispatch(fetchSongsByType({ songType: keyword, pageNum: 1, pageSize }));
        setLocalQuery("");
    };


    return (
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
                    <FrostedButton><CasinoTwoToneIcon /><span className="text-lg font-fold">随机歌曲</span></FrostedButton>
                    <FrostedButton><DiamondTwoToneIcon sx={{ color: amber[700] }} /><span className="text-lg font-fold text-amber-500">SC歌曲</span></FrostedButton>
                    {candidateJson.map((btn, index) => (
                        <FrostedButton key={index} onClick={() => handleButtonClick(btn.keyword)}>
                            <span className="text-lg font-fold" style={{ color: pink[600] }}>{btn.name}</span>
                        </FrostedButton>
                    ))}

                </div>
            </CardContent>
        </RawBlurCard>
    );
}
