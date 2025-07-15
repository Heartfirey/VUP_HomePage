import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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
import { OptimizedRawBlurCardNoAnimate } from './OptimizedBlurCard';
import FrostedButton from './FrostedButton';
import { blue, amber } from '@mui/material/colors';
import { getOptimizedBlurStyle } from '../utils/blurOptimization';
import performanceConfig from '../utils/performanceConfig';
import {
    fetchSongsByKeyValue,
    fetchCandidatesByName,
    setSearchQuery,
    setPersistentSearch,
    resetSongs
} from '../store/songSlice';
import CopyToClipboardSnackbar from '../services/copyUtils';
import { getRandomSong } from '../services/API/backend/songApi';

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
];

// 记忆化的按钮组件
const MemoizedFrostedButton = React.memo(FrostedButton);

const SearchCard = React.memo(() => {
    const dispatch = useDispatch();
    const { pageSize, candidateSuggestions } = useSelector(state => state.song);
    const [localQuery, setLocalQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPopper, setOpenPopper] = useState(false);
    const [isSuperSong, setIsSuperSong] = useState(false);
    const copyRef = useRef();
    
    // 防抖搜索
    const debouncedQuery = useRef(null);
    
    // 获取性能配置
    const blurConfig = useMemo(() => performanceConfig.getBlurConfig(), []);
    
    // 优化的模糊样式
    const optimizedPopperStyle = useMemo(() => {
        if (!blurConfig.enabled) {
            return {
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            };
        }
        
        const blurStyle = getOptimizedBlurStyle(20, 'normal');
        return {
            ...blurStyle,
            background: blurStyle.backgroundColor || 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
        };
    }, [blurConfig]);

    useEffect(() => {
        // 清除之前的定时器
        if (debouncedQuery.current) {
            clearTimeout(debouncedQuery.current);
        }
        
        // 延迟执行搜索
        debouncedQuery.current = setTimeout(() => {
            if (localQuery.trim()) {
                dispatch(setSearchQuery(localQuery));
                dispatch(fetchCandidatesByName({ localQuery, pageNum: 1, pageSize }));
            }
        }, 300); // 增加防抖延迟到300ms
        
        return () => {
            if (debouncedQuery.current) {
                clearTimeout(debouncedQuery.current);
            }
        };
    }, [localQuery, dispatch, pageSize]);

    // 记忆化事件处理函数
    const handleSearchClick = useCallback(() => {
        if (localQuery.trim() === "") return;
        dispatch(setSearchQuery(localQuery));
        dispatch(fetchCandidatesByName({ localQuery, pageNum: 1, pageSize }));
    }, [localQuery, dispatch, pageSize]);

    const handleCandidateClick = useCallback((candidate) => {
        dispatch(setPersistentSearch({ mode: "id", keyword: candidate.id }));
        dispatch(resetSongs());
        dispatch(fetchSongsByKeyValue({ key: 'id', value: candidate.id, pageNum: 1, pageSize }));
        setOpenPopper(false);
    }, [dispatch, pageSize]);

    const handleButtonClick = useCallback((keyword, reqKey) => {
        dispatch(setPersistentSearch({ mode: "songType", keyword: keyword }));
        dispatch(resetSongs());
        dispatch(fetchSongsByKeyValue({ key: reqKey, value: keyword, pageNum: 1, pageSize }));
        setLocalQuery("");
    }, [dispatch, pageSize]);

    const handleRandomSongClick = useCallback(() => {
        getRandomSong().then((res) => {
            const song = res.data;
            if (copyRef.current) {
                copyRef.current.copy(song.songName);
            }
        });
    }, []);

    const handleSuperSongClick = useCallback(() => {
        if (isSuperSong) {
            dispatch(setPersistentSearch({ mode: 'songType', keyword: '' }));
            dispatch(resetSongs());
            dispatch(fetchSongsByKeyValue({ key: 'songType', value: '', pageNum: 1, pageSize: 10 }));
            setLocalQuery("");
        } else {
            dispatch(setPersistentSearch({ mode: 'isSuper', keyword: 1 }));
            dispatch(resetSongs());
            dispatch(fetchSongsByKeyValue({ key: 'isSuper', value: 1, pageNum: 1, pageSize: 10 }));
        }
        setIsSuperSong(!isSuperSong);
    }, [isSuperSong, dispatch, pageSize]);

    // 记忆化候选建议
    const memoizedCandidates = useMemo(() => {
        return candidateSuggestions.slice(0, 5); // 限制显示数量以提升性能
    }, [candidateSuggestions]);

    // 记忆化按钮列表
    const memoizedButtons = useMemo(() => {
        return candidateJson.map((btn, index) => (
            <MemoizedFrostedButton 
                key={`${btn.keyword}-${index}`} 
                onClick={() => handleButtonClick(btn.keyword, btn.reqKey)}
            >
                <span className="text-lg font-fold" style={{ color: blue[600] }}>{btn.name}</span>
            </MemoizedFrostedButton>
        ));
    }, [handleButtonClick]);

    return (
        <>
        <OptimizedRawBlurCardNoAnimate className="overflow-visible" blurPriority="high">
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
                        marginTop: '12px'
                    }}
                >
                    <Paper 
                        elevation={0}
                        sx={optimizedPopperStyle}
                    >
                        <List dense sx={{ py: 0 }}>
                            {candidateSuggestions?.map((candidate, index) => (
                                <ListItem
                                    key={candidate.id}
                                    button
                                    onClick={() => handleCandidateClick(candidate)}
                                    sx={{
                                        py: 1.5,
                                        px: 2,
                                        borderBottom: index < candidateSuggestions.length - 1 ? 
                                            '1px solid rgba(0, 0, 0, 0.06)' : 'none',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'translateX(4px)',
                                        },
                                        '&:active': {
                                            transform: 'translateX(2px) scale(0.98)',
                                        }
                                    }}
                                >
                                    <LibraryMusicTwoToneIcon 
                                        sx={{ 
                                            mr: 1.5, 
                                            color: blue[500],
                                            fontSize: '1.2rem'
                                        }} 
                                    />
                                    <ListItemText
                                        primary={
                                            <Typography 
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: 'rgba(0, 0, 0, 0.87)',
                                                    fontSize: '0.95rem'
                                                }}
                                            >
                                                {candidate.songName}
                                                {candidate.songOwner && (
                                                    <span style={{ fontWeight: 400, color: 'rgba(0, 0, 0, 0.6)' }}>
                                                        {' - '}{candidate.songOwner}
                                                    </span>
                                                )}
                                                {candidate.songType && (
                                                    <span style={{ 
                                                        fontWeight: 400, 
                                                        color: blue[500],
                                                        fontSize: '0.85rem',
                                                        marginLeft: '8px'
                                                    }}>
                                                        ({candidate.songType})
                                                    </span>
                                                )}
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
                    {memoizedButtons}
                </div>
            </CardContent>
        </OptimizedRawBlurCardNoAnimate>
        <CopyToClipboardSnackbar ref={copyRef} />
        </>
    );
});

SearchCard.displayName = 'SearchCard';

export default SearchCard;
