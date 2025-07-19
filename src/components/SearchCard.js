import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    InputBase,
    IconButton,
    Box,
    Chip,
    Button,
    Popper,
    List,
    ListItem,
    ListItemText,
    Typography,
    Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { RawBlurCardNoAnimate } from './RawBlurCard';
import {
    fetchSongsByKeyValue,
    fetchCandidatesByName,
    fetchSongsByBlur,
    fetchSongsByLyrics,
    setSearchQuery,
    setPersistentSearch,
    setPageSize,
    resetSongs
} from '../store/songSlice';
import CopyToClipboardSnackbar from '../services/copyUtils';
import { getRandomSong } from '../services/API/backend/songApi';

// Icons
import LibraryMusicTwoToneIcon from '@mui/icons-material/LibraryMusicTwoTone';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DiamondIcon from '@mui/icons-material/Diamond';
import LanguageIcon from '@mui/icons-material/Language';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CategoryIcon from '@mui/icons-material/Category';
import LyricsIcon from '@mui/icons-material/Lyrics';
// Badge 图标
import TranslateIcon from '@mui/icons-material/Translate';
import PaletteIcon from '@mui/icons-material/Palette';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NatureIcon from '@mui/icons-material/Nature';
import CreateIcon from '@mui/icons-material/Create';
import ChildCareIcon from '@mui/icons-material/ChildCare';

// 分类数据结构优化
const categoryConfig = {
    quickActions: [
        { 
            name: "随机歌曲", 
            icon: ShuffleIcon, 
            color: '#2196F3',
            action: 'random'
        },
        { 
            name: "SC歌曲", 
            icon: DiamondIcon, 
            color: '#FF9800',
            action: 'super'
        },
        { 
            name: "全部歌曲", 
            icon: AllInclusiveIcon, 
            color: '#4CAF50',
            keyword: "", 
            reqKey: "songType" 
        }
    ],
    languages: [
        { name: "国语", keyword: "国语", reqKey: "language", icon: TranslateIcon },
        { name: "日语", keyword: "日语", reqKey: "songType", icon: TranslateIcon },
        { name: "粤语", keyword: "粤语", reqKey: "songType", icon: TranslateIcon },
        { name: "韩语", keyword: "韩语", reqKey: "songType", icon: TranslateIcon }
    ],
    genres: [
        { name: "古风", keyword: "古风", reqKey: "songType", icon: PaletteIcon },
        { name: "流行", keyword: "流行", reqKey: "songType", icon: TrendingUpIcon },
        { name: "民谣", keyword: "民谣", reqKey: "songType", icon: NatureIcon },
        { name: "原创", keyword: "原创", reqKey: "songType", icon: CreateIcon },
        { name: "儿歌", keyword: "儿歌", reqKey: "songType", icon: ChildCareIcon }
    ]
};

const SearchCard = React.memo(() => {
    const dispatch = useDispatch();
    const { pageSize, candidateSuggestions } = useSelector(state => state.song);
    const [localQuery, setLocalQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPopper, setOpenPopper] = useState(false);
    const [isSuperSong, setIsSuperSong] = useState(false);
    const [selectedBadges, setSelectedBadges] = useState(new Set()); // 新增：选中的Badge状态
    const [dynamicPageSize, setDynamicPageSize] = useState(15);
    const [searchMode, setSearchMode] = useState('regular'); // 新增：搜索模式状态 ('regular' | 'lyrics')
    const copyRef = useRef();
    const dynamicPageSizeRef = useRef(15);
    
    // 防抖搜索
    const debouncedQuery = useRef(null);
    
    // 更新pageSize ref
    useEffect(() => {
        dynamicPageSizeRef.current = dynamicPageSize;
    }, [dynamicPageSize]);

    useEffect(() => {
        const calculatePageSize = () => {
            const width = window.innerWidth;
            if (width < 640) { // 手机端 (xs) - 1列
                return 15; // 1列 * 15行 = 15个
            } else if (width < 768) { // 小屏平板 (sm) - 2列
                return 24; // 2列 * 12行 = 24个
            } else if (width < 1024) { // 中屏平板 (md) - 3列
                return 24; // 3列 * 8行 = 24个
            } else { // 大屏电脑 (lg+) - 4列
                return 28; // 4列 * 7行 = 28个
            }
        };

        const handleResize = () => {
            const newPageSize = calculatePageSize();
            setDynamicPageSize(newPageSize);
            dispatch(setPageSize(newPageSize));
        };

        // 初始计算
        handleResize();
        
        // 监听窗口大小变化
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch]); // 只依赖dispatch

    useEffect(() => {
        // 清除之前的定时器
        if (debouncedQuery.current) {
            clearTimeout(debouncedQuery.current);
        }
        
        debouncedQuery.current = setTimeout(() => {
            if (localQuery.trim()) {
                dispatch(fetchCandidatesByName({ localQuery, pageNum: 1, pageSize: dynamicPageSizeRef.current }));
            }
        }, 300);
        
        return () => {
            if (debouncedQuery.current) {
                clearTimeout(debouncedQuery.current);
            }
        };
    }, [localQuery, dispatch]); // 移除dynamicPageSize依赖

    // 事件处理函数
    const handleSearchClick = useCallback(() => {
        const trimmedQuery = localQuery.trim();
        
        dispatch(setSearchQuery(trimmedQuery));
        
        if (searchMode === 'lyrics') {
            if (trimmedQuery === "") {
                // 空内容歌词搜索 - 显示所有歌曲
                dispatch(setPersistentSearch({ mode: "songType", keyword: "" }));
                dispatch(resetSongs());
                dispatch(fetchSongsByKeyValue({ 
                    key: 'songType', 
                    value: '', 
                    pageNum: 1, 
                    pageSize: dynamicPageSizeRef.current 
                }));
            } else {
                // 正常歌词搜索
                dispatch(setPersistentSearch({ mode: "lyrics", keyword: trimmedQuery }));
                dispatch(resetSongs());
                dispatch(fetchSongsByLyrics({ 
                    keyword: trimmedQuery, 
                    pageNum: 1, 
                    pageSize: dynamicPageSizeRef.current 
                }));
            }
        } else {
            if (trimmedQuery === "") {
                // 空内容普通搜索 - 显示所有歌曲
                dispatch(setPersistentSearch({ mode: "songType", keyword: "" }));
                dispatch(resetSongs());
                dispatch(fetchSongsByKeyValue({ 
                    key: 'songType', 
                    value: '', 
                    pageNum: 1, 
                    pageSize: dynamicPageSizeRef.current 
                }));
            } else {
                // 正常模糊搜索
                dispatch(setPersistentSearch({ mode: "blur", keyword: trimmedQuery }));
                dispatch(resetSongs());
                dispatch(fetchSongsByBlur({ 
                    keyword: trimmedQuery, 
                    pageNum: 1, 
                    pageSize: dynamicPageSizeRef.current 
                }));
            }
        }
        
        // 重置其他状态
        setSelectedBadges(new Set());
        setIsSuperSong(false);
        setOpenPopper(false);
    }, [localQuery, searchMode, dispatch]);

    const handleCandidateClick = useCallback((candidate) => {
        dispatch(setPersistentSearch({ mode: "id", keyword: candidate.id }));
        dispatch(resetSongs());
        dispatch(fetchSongsByKeyValue({ key: 'id', value: candidate.id, pageNum: 1, pageSize: dynamicPageSizeRef.current }));
        setOpenPopper(false);
        setLocalQuery(candidate.songName);
    }, [dispatch]);

    const handleCategoryClick = useCallback((keyword, reqKey) => {
        const badgeKey = `${reqKey}-${keyword}`;
        
        setIsSuperSong(false);
        
        setSelectedBadges(prev => {
            const newSet = new Set();
            if (!prev.has(badgeKey)) {
                newSet.add(badgeKey);
            }
            return newSet;
        });
        
        if (selectedBadges.has(badgeKey)) {
            dispatch(setPersistentSearch({ mode: "songType", keyword: "" }));
            dispatch(resetSongs());
            dispatch(fetchSongsByKeyValue({ key: 'songType', value: '', pageNum: 1, pageSize: dynamicPageSizeRef.current }));
        } else {
            dispatch(setPersistentSearch({ mode: "songType", keyword: keyword }));
            dispatch(resetSongs());
            dispatch(fetchSongsByKeyValue({ key: reqKey, value: keyword, pageNum: 1, pageSize: dynamicPageSizeRef.current }));
        }
        setLocalQuery("");
    }, [dispatch, selectedBadges]);

    const handleQuickAction = useCallback((action) => {
        if (action === 'random') {
            getRandomSong().then((res) => {
                const song = res.data;
                if (copyRef.current) {
                    copyRef.current.copy(song.songName);
                }
            });
        } else if (action === 'super') {
            // 重置badge选中状态
            setSelectedBadges(new Set());
            
            if (isSuperSong) {
                dispatch(setPersistentSearch({ mode: 'songType', keyword: '' }));
                dispatch(resetSongs());
                dispatch(fetchSongsByKeyValue({ key: 'songType', value: '', pageNum: 1, pageSize: dynamicPageSizeRef.current }));
            } else {
                dispatch(setPersistentSearch({ mode: 'isSuper', keyword: 1 }));
                dispatch(resetSongs());
                dispatch(fetchSongsByKeyValue({ key: 'isSuper', value: 1, pageNum: 1, pageSize: dynamicPageSizeRef.current }));
            }
            setIsSuperSong(!isSuperSong);
            setLocalQuery("");
        }
    }, [dispatch, isSuperSong]);

    const handleClearSearch = useCallback(() => {
        setLocalQuery("");
        setOpenPopper(false);
        
        // 清除搜索内容时，恢复显示全部歌曲
        dispatch(setPersistentSearch({ mode: "songType", keyword: "" }));
        dispatch(resetSongs());
        dispatch(fetchSongsByKeyValue({ key: 'songType', value: '', pageNum: 1, pageSize: dynamicPageSizeRef.current }));
        
        // 重置其他状态
        setSelectedBadges(new Set());
        setIsSuperSong(false);
    }, [dispatch]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    }, [handleSearchClick]);

    return (
        <>
            <RawBlurCardNoAnimate>
                <Box className="px-6 py-4 space-y-3">
                    {/* 搜索框区域 */}
                    <Box className="relative">
                        <Paper
                            elevation={0}
                            className="relative overflow-hidden"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '16px',
                                border: searchMode === 'lyrics' 
                                    ? '1px solid rgba(0, 150, 136, 0.3)'
                                    : '1px solid rgba(255, 255, 255, 0.3)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: searchMode === 'lyrics'
                                    ? '0 8px 32px rgba(0, 150, 136, 0.06)'
                                    : '0 8px 32px rgba(0, 0, 0, 0.06)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: searchMode === 'lyrics'
                                        ? '0 12px 40px rgba(0, 150, 136, 0.08)'
                                        : '0 12px 40px rgba(0, 0, 0, 0.08)',
                                },
                                '&:focus-within': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                    border: searchMode === 'lyrics'
                                        ? '1px solid #009688'
                                        : '1px solid #2196F3',
                                    boxShadow: searchMode === 'lyrics'
                                        ? '0 12px 40px rgba(0, 150, 136, 0.15)'
                                        : '0 12px 40px rgba(33, 150, 243, 0.15)',
                                }
                            }}
                            ref={setAnchorEl}
                        >
                            <Box className="flex items-center px-3 py-2">
                                <LibraryMusicTwoToneIcon 
                                    sx={{ 
                                        color: searchMode === 'lyrics' ? '#009688' : '#2196F3', 
                                        fontSize: 24,
                                        mr: 2,
                                        transition: 'all 0.3s ease'
                                    }} 
                                />
                                <InputBase
                                    placeholder={searchMode === 'lyrics' ? '搜索歌词内容...' : '搜索歌曲 / 歌手'}
                                    value={localQuery}
                                    onChange={(e) => setLocalQuery(e.target.value)}
                                    onFocus={() => setOpenPopper(true)}
                                    onBlur={() => setTimeout(() => setOpenPopper(false), 200)}
                                    onKeyPress={handleKeyPress}
                                    sx={{
                                        flex: 1,
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        color: '#1a1a1a',
                                        '& .MuiInputBase-input::placeholder': {
                                            color: searchMode === 'lyrics' ? '#009688' : '#2196F3',
                                            opacity: 0.7,
                                            transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }
                                    }}
                                />
                                
                                {localQuery.trim() && (
                                    <IconButton
                                        size="small"
                                        onClick={handleClearSearch}
                                        sx={{
                                            mr: 1,
                                            background: 'rgba(244, 67, 54, 0.1)',
                                            color: '#f44336',
                                            borderRadius: '8px',
                                            width: '32px',
                                            height: '32px',
                                            transition: 'all 0.2s ease',
                                            '&:hover': { 
                                                background: 'rgba(244, 67, 54, 0.15)',
                                                color: '#d32f2f',
                                                transform: 'scale(1.05)',
                                            }
                                        }}
                                    >
                                        <ClearIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                )}
                                
                                {/* 搜索模式切换按钮 */}
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setSearchMode(searchMode === 'regular' ? 'lyrics' : 'regular');
                                        setOpenPopper(false);
                                    }}
                                    sx={{
                                        mr: 1,
                                        width: 36,
                                        height: 36,
                                        backgroundColor: searchMode === 'lyrics' 
                                            ? 'rgba(0, 150, 136, 0.1)' 
                                            : 'rgba(33, 150, 243, 0.1)',
                                        border: searchMode === 'lyrics'
                                            ? '2px solid rgba(0, 150, 136, 0.3)'
                                            : '2px solid rgba(33, 150, 243, 0.3)',
                                        color: searchMode === 'lyrics' ? '#009688' : '#2196F3',
                                        borderRadius: '12px',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: searchMode === 'lyrics'
                                                ? 'rgba(0, 150, 136, 0.15)'
                                                : 'rgba(33, 150, 243, 0.15)',
                                            border: searchMode === 'lyrics'
                                                ? '2px solid rgba(0, 150, 136, 0.5)'
                                                : '2px solid rgba(33, 150, 243, 0.5)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: searchMode === 'lyrics'
                                                ? '0 4px 12px rgba(0, 150, 136, 0.2)'
                                                : '0 4px 12px rgba(33, 150, 243, 0.2)'
                                        },
                                        '&:active': {
                                            transform: 'translateY(0px)'
                                        }
                                    }}
                                >
                                    {searchMode === 'lyrics' ? (
                                        <LyricsIcon sx={{ fontSize: 18 }} />
                                    ) : (
                                        <MusicNoteIcon sx={{ fontSize: 18 }} />
                                    )}
                                </IconButton>
                                
                                <IconButton 
                                    onClick={handleSearchClick}
                                    sx={{
                                        background: searchMode === 'lyrics' 
                                            ? 'linear-gradient(135deg, #009688, #4DB6AC)' 
                                            : 'linear-gradient(135deg, #2196F3, #42A5F5)',
                                        color: '#ffffff',
                                        borderRadius: '10px',
                                        width: '40px',
                                        height: '40px',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        border: 'none',
                                        boxShadow: searchMode === 'lyrics'
                                            ? '0 4px 16px rgba(0, 150, 136, 0.3)'
                                            : '0 4px 16px rgba(33, 150, 243, 0.3)',
                                        '&:hover': {
                                            background: searchMode === 'lyrics'
                                                ? 'linear-gradient(135deg, #00695C, #009688)'
                                                : 'linear-gradient(135deg, #1976D2, #1E88E5)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: searchMode === 'lyrics'
                                                ? '0 6px 20px rgba(0, 150, 136, 0.4)'
                                                : '0 6px 20px rgba(33, 150, 243, 0.4)',
                                        },
                                        '&:active': {
                                            transform: 'translateY(0px)',
                                        },
                                        '&:disabled': {
                                            background: 'rgba(224, 224, 224, 0.5)',
                                            color: '#bdbdbd'
                                        }
                                    }}
                                >
                                    <SearchIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                            </Box>
                        </Paper>

                        {/* 搜索建议下拉 */}
                        <Popper
                            open={!!(candidateSuggestions?.length && openPopper && localQuery.trim())}
                            anchorEl={anchorEl}
                            placement="bottom-start"
                            transition
                            sx={{
                                width: anchorEl?.offsetWidth,
                                zIndex: 1300,
                                mt: 1
                            }}
                        >
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={200}>
                                    <Paper 
                                        elevation={0}
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            border: searchMode === 'lyrics'
                                                ? '1px solid rgba(0, 150, 136, 0.3)'
                                                : '1px solid rgba(255, 255, 255, 0.3)',
                                            backdropFilter: 'blur(20px)',
                                            WebkitBackdropFilter: 'blur(20px)',
                                            boxShadow: searchMode === 'lyrics'
                                                ? '0 8px 32px rgba(0, 150, 136, 0.1)'
                                                : '0 8px 32px rgba(0, 0, 0, 0.1)',
                                            overflow: 'hidden',
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        <List dense sx={{ py: 0 }}>
                                            {candidateSuggestions?.slice(0, 8).map((candidate, index) => (
                                                <ListItem
                                                    key={candidate.id}
                                                    button
                                                    onClick={() => handleCandidateClick(candidate)}
                                                    sx={{
                                                        py: 1.5,
                                                        px: 3,
                                                        borderBottom: index < candidateSuggestions.length - 1 ? 
                                                            '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                                                        transition: 'all 0.2s ease-in-out',
                                                        '&:hover': {
                                                            backgroundColor: searchMode === 'lyrics'
                                                                ? 'rgba(0, 150, 136, 0.08)'
                                                                : 'rgba(33, 150, 243, 0.08)',
                                                            transform: 'translateX(4px)',
                                                        }
                                                    }}
                                                >
                                                    {searchMode === 'lyrics' ? (
                                                        <LyricsIcon 
                                                            sx={{ 
                                                                mr: 2, 
                                                                color: '#FF9800',
                                                                fontSize: '1.1rem'
                                                            }} 
                                                        />
                                                    ) : (
                                                        <MusicNoteIcon 
                                                            sx={{ 
                                                                mr: 2, 
                                                                color: '#2196F3',
                                                                fontSize: '1.1rem'
                                                            }} 
                                                        />
                                                    )}
                                                    <ListItemText
                                                        primary={
                                                            searchMode === 'lyrics' ? (
                                                                <Box>
                                                                    <Typography 
                                                                        variant="body2"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                            color: '#1a1a1a',
                                                                            fontSize: '0.95rem',
                                                                            mb: 0.5
                                                                        }}
                                                                    >
                                                                        {candidate.songName}
                                                                        {candidate.songOwner && (
                                                                            <span style={{ 
                                                                                fontWeight: 400, 
                                                                                color: '#757575',
                                                                                marginLeft: '8px'
                                                                            }}>
                                                                                - {candidate.songOwner}
                                                                            </span>
                                                                        )}
                                                                    </Typography>
                                                                    {/* 显示歌词片段提示 */}
                                                                    <Typography 
                                                                        variant="caption"
                                                                        sx={{
                                                                            color: '#FF9800',
                                                                            fontStyle: 'italic',
                                                                            fontSize: '0.8rem'
                                                                        }}
                                                                    >
                                                                        点击查看歌词匹配结果
                                                                    </Typography>
                                                                </Box>
                                                            ) : (
                                                                <Typography 
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        color: '#1a1a1a',
                                                                        fontSize: '0.95rem'
                                                                    }}
                                                                >
                                                                    {candidate.songName}
                                                                    {candidate.songOwner && (
                                                                        <span style={{ 
                                                                            fontWeight: 400, 
                                                                            color: '#757575',
                                                                            marginLeft: '8px'
                                                                        }}>
                                                                            - {candidate.songOwner}
                                                                        </span>
                                                                    )}
                                                                    {candidate.songType && (
                                                                        <Chip
                                                                            label={candidate.songType}
                                                                            size="small"
                                                                            sx={{
                                                                                ml: 1,
                                                                                height: '20px',
                                                                                fontSize: '0.75rem',
                                                                                background: 'linear-gradient(135deg, #2196F3, #42A5F5)',
                                                                                color: '#ffffff',
                                                                                border: 'none',
                                                                                fontWeight: 600
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Typography>
                                                            )
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>
                    </Box>

                    {/* 左右布局：左侧分类，右侧快捷操作 */}
                    <Box 
                        className="grid grid-cols-1 lg:grid-cols-2"
                        sx={{
                            gap: { xs: 1.5, lg: 3 } // 手机端大幅减少间距到20px
                        }}
                    >
                        {/* 左侧：筛选选项 */}
                        <Box>
                            {/* 筛选选项标题 */}
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    color: '#757575', 
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    mb: { xs: 1, sm: 2 }, // 手机端进一步减少底部间距
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}
                            >
                                <CategoryIcon sx={{ fontSize: 14 }} />
                                筛选选项
                            </Typography>
                            
                            {/* 语言和风格分类 */}
                            <Box 
                                className="flex flex-col"
                                sx={{ 
                                    backgroundColor: 'transparent !important',
                                    // 响应式间距：手机端更紧凑，桌面端保持原样
                                    gap: { xs: 1.5, sm: 2 }, // 手机端进一步减少间距到12px
                                    // 给弹跳动画留出空间
                                    paddingTop: '2px',
                                    paddingBottom: '2px'
                                }}
                            >
                                {/* 语言分类 */}
                                <Box 
                                    className="flex items-center"
                                    sx={{ 
                                        backgroundColor: 'transparent !important',
                                        alignItems: 'center', // 改回center，保证标题和badge垂直居中对齐
                                        gap: { xs: 2, sm: 3 } // 手机端减少标题与badge之间的间距
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            color: '#757575', 
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            minWidth: 'fit-content',
                                            flexShrink: 0
                                        }}
                                    >
                                        <LanguageIcon sx={{ fontSize: 14, color: '#9C27B0' }} />
                                        语言
                                    </Typography>
                                    <Box 
                                        className="flex-1"
                                        sx={{
                                            backgroundColor: 'transparent !important',
                                            // 手机端：横向滚动，不换行，隐藏滚动条，给弹跳动画留空间
                                            '@media (max-width: 600px)': {
                                                overflowX: 'auto',
                                                overflowY: 'visible', // 改为visible，不截断弹跳动画
                                                scrollbarWidth: 'none', // Firefox
                                                '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
                                                msOverflowStyle: 'none', // IE 10+
                                                paddingTop: '4px', // 给弹跳动画留上方空间
                                                paddingBottom: '4px', // 给弹跳动画留下方空间
                                            }
                                        }}
                                    >
                                        <Box 
                                            className="flex gap-1.5"
                                            sx={{
                                                backgroundColor: 'transparent !important',
                                                // 手机端：不换行
                                                '@media (max-width: 600px)': {
                                                    flexWrap: 'nowrap',
                                                    minWidth: 'max-content'
                                                },
                                                // 大屏：正常换行
                                                '@media (min-width: 601px)': {
                                                    flexWrap: 'wrap'
                                                }
                                            }}
                                        >
                                            {categoryConfig.languages.map((lang) => {
                                                const IconComponent = lang.icon;
                                                const badgeKey = `${lang.reqKey}-${lang.keyword}`;
                                                const isSelected = selectedBadges.has(badgeKey);
                                                
                                                return (
                                                    <Chip
                                                        key={lang.name}
                                                        label={lang.name}
                                                        icon={<IconComponent sx={{ 
                                                            fontSize: '12px !important', 
                                                            color: isSelected ? '#9C27B0' : '#ffffff' 
                                                        }} />}
                                                        onClick={() => handleCategoryClick(lang.keyword, lang.reqKey)}
                                                        clickable
                                                        size="small"
                                                        sx={{
                                                            background: isSelected 
                                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))'
                                                                : 'linear-gradient(135deg, #9C27B0, #BA68C8)',
                                                            color: isSelected ? '#9C27B0' : '#ffffff',
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            height: '26px',
                                                            borderRadius: '13px',
                                                            border: isSelected ? '2px solid #9C27B0' : 'none',
                                                            transition: 'all 0.2s ease',
                                                            minWidth: '50px',
                                                            flex: '0 0 auto',
                                                            '& .MuiChip-icon': {
                                                                marginLeft: '8px',
                                                                marginRight: '0px',
                                                                color: isSelected ? '#9C27B0' : '#ffffff !important'
                                                            },
                                                            '&:hover': {
                                                                background: isSelected
                                                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.9))'
                                                                    : 'linear-gradient(135deg, #8E24AA, #9C27B0)',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* 风格分类 */}
                                <Box 
                                    className="flex items-center"
                                    sx={{ 
                                        backgroundColor: 'transparent !important',
                                        alignItems: 'center', // 改回center，保证标题和badge垂直居中对齐
                                        gap: { xs: 2, sm: 3 } // 手机端减少标题与badge之间的间距
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle2" 
                                        sx={{ 
                                            color: '#757575', 
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            minWidth: 'fit-content',
                                            flexShrink: 0
                                        }}
                                    >
                                        <MusicNoteIcon sx={{ fontSize: 14, color: '#2196F3' }} />
                                        风格
                                    </Typography>
                                    <Box 
                                        className="flex-1"
                                        sx={{
                                            backgroundColor: 'transparent !important',
                                            // 手机端：横向滚动，不换行，隐藏滚动条，给弹跳动画留空间
                                            '@media (max-width: 600px)': {
                                                overflowX: 'auto',
                                                overflowY: 'visible', // 改为visible，不截断弹跳动画
                                                scrollbarWidth: 'none', // Firefox
                                                '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
                                                msOverflowStyle: 'none', // IE 10+
                                                paddingTop: '4px', // 给弹跳动画留上方空间
                                                paddingBottom: '2px', // 给弹跳动画留下方空间
                                            }
                                        }}
                                    >
                                        <Box 
                                            className="flex gap-1.5"
                                            sx={{
                                                backgroundColor: 'transparent !important',
                                                // 手机端：不换行
                                                '@media (max-width: 600px)': {
                                                    flexWrap: 'nowrap',
                                                    minWidth: 'max-content'
                                                },
                                                // 大屏：正常换行
                                                '@media (min-width: 601px)': {
                                                    flexWrap: 'wrap'
                                                }
                                            }}
                                        >
                                            {categoryConfig.genres.map((genre) => {
                                                const IconComponent = genre.icon;
                                                const badgeKey = `${genre.reqKey}-${genre.keyword}`;
                                                const isSelected = selectedBadges.has(badgeKey);
                                                
                                                return (
                                                    <Chip
                                                        key={genre.name}
                                                        label={genre.name}
                                                        icon={<IconComponent sx={{ 
                                                            fontSize: '12px !important', 
                                                            color: isSelected ? '#2196F3' : '#ffffff' 
                                                        }} />}
                                                        onClick={() => handleCategoryClick(genre.keyword, genre.reqKey)}
                                                        clickable
                                                        size="small"
                                                        sx={{
                                                            background: isSelected 
                                                                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))'
                                                                : 'linear-gradient(135deg, #2196F3, #42A5F5)',
                                                            color: isSelected ? '#2196F3' : '#ffffff',
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            height: '26px',
                                                            borderRadius: '13px',
                                                            border: isSelected ? '2px solid #2196F3' : 'none',
                                                            transition: 'all 0.2s ease',
                                                            minWidth: '50px',
                                                            flex: '0 0 auto',
                                                            '& .MuiChip-icon': {
                                                                marginLeft: '8px',
                                                                marginRight: '0px',
                                                                color: isSelected ? '#2196F3' : '#ffffff !important'
                                                            },
                                                            '&:hover': {
                                                                background: isSelected
                                                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.9))'
                                                                    : 'linear-gradient(135deg, #1976D2, #1E88E5)',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* 右侧：快捷操作 */}
                        <Box>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    color: '#757575', 
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    mb: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}
                            >
                                <ShuffleIcon sx={{ fontSize: 14 }} />
                                快捷操作
                            </Typography>
                            <Box 
                                className="flex gap-2"
                                sx={{ 
                                    overflow: 'visible !important',
                                    pb: 1 // 给按钮向上弹跳留出空间
                                }}
                            >
                                {categoryConfig.quickActions.map((action, index) => {
                                    const IconComponent = action.icon;
                                    const isActive = action.action === 'super' && isSuperSong;
                                    
                                    return (
                                        <Button
                                            key={action.name}
                                            variant="contained"
                                            startIcon={<IconComponent sx={{ fontSize: 16 }} />}
                                            onClick={() => {
                                                if (action.action) {
                                                    handleQuickAction(action.action);
                                                } else {
                                                    // 全部歌曲按钮：重置badge选中状态和SC按钮状态
                                                    setSelectedBadges(new Set());
                                                    setIsSuperSong(false); // 重置SC按钮状态
                                                    handleCategoryClick(action.keyword, action.reqKey);
                                                }
                                            }}
                                            sx={{
                                                borderRadius: '12px',
                                                px: 2,
                                                py: 1.5,
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                textTransform: 'none',
                                                backgroundColor: isActive && action.action === 'super' 
                                                    ? 'rgba(255, 255, 255, 0.95)' 
                                                    : action.color,
                                                color: isActive && action.action === 'super' 
                                                    ? action.color 
                                                    : '#ffffff',
                                                border: isActive && action.action === 'super' 
                                                    ? `2px solid ${action.color}` 
                                                    : `2px solid transparent`,
                                                boxShadow: isActive && action.action === 'super'
                                                    ? `0 6px 20px ${action.color}30, inset 0 1px 0 rgba(255,255,255,0.8)` 
                                                    : `0 4px 16px ${action.color}30`,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                flex: '1',
                                                minWidth: '0',
                                                whiteSpace: 'nowrap',
                                                transform: 'translateZ(0)', // 硬件加速
                                                '& .MuiButton-startIcon': {
                                                    marginRight: '6px',
                                                    marginLeft: '0px'
                                                },
                                                '&:hover': {
                                                    backgroundColor: isActive && action.action === 'super' 
                                                        ? 'rgba(255, 255, 255, 0.98)' 
                                                        : action.color,
                                                    color: isActive && action.action === 'super' 
                                                        ? action.color 
                                                        : '#ffffff',
                                                    transform: 'translateY(-2px) translateZ(0)',
                                                    boxShadow: isActive && action.action === 'super'
                                                        ? `0 8px 25px ${action.color}40, inset 0 1px 0 rgba(255,255,255,0.9)`
                                                        : `0 8px 24px ${action.color}40`,
                                                },
                                                '&:active': {
                                                    transform: 'translateY(-1px) translateZ(0)',
                                                }
                                            }}
                                        >
                                            {action.name}
                                        </Button>
                                    );
                                })}
                            </Box>
                            
                            {/* 温馨提示 */}
                            <Box 
                                sx={{ 
                                    mt: 0,
                                    py: 0.5,
                                    px: 1.5,
                                    backgroundColor: searchMode === 'lyrics' 
                                        ? 'rgba(0, 150, 136, 0.08)' 
                                        : 'rgba(33, 150, 243, 0.08)',
                                    borderRadius: '6px',
                                    border: searchMode === 'lyrics'
                                        ? '1px solid rgba(0, 150, 136, 0.2)'
                                        : '1px solid rgba(33, 150, 243, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.8,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                <LibraryMusicTwoToneIcon 
                                    sx={{ 
                                        color: searchMode === 'lyrics' ? '#009688' : '#2196F3', 
                                        fontSize: '20px',
                                        opacity: 0.7,
                                        transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }} 
                                />
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: searchMode === 'lyrics' ? '#00695C' : '#1976D2',
                                        fontSize: '0.7rem',
                                        fontWeight: 500,
                                        lineHeight: 1.2,
                                        transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    单击歌曲可自动复制到剪切板，双击可查看详情哦～
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </RawBlurCardNoAnimate>
            <CopyToClipboardSnackbar ref={copyRef} />
        </>
    );
});

SearchCard.displayName = 'SearchCard';

export default SearchCard;
