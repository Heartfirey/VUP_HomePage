import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    CircularProgress,
    Grid,
    Fade,
    Tooltip
} from '@mui/material';
import { setPersistentSearch, fetchSongsByKeyValue } from '../store/songSlice';
import { motion, AnimatePresence } from 'framer-motion';
import CopyToClipboardSnackbar from '../services/copyUtils';

// 导入背景图片
import PhoneCardBG from '../assets/PhoneCardBG.png';
import MdCardBG from '../assets/MdCardBG.png';

// Icons
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import DiamondIcon from '@mui/icons-material/Diamond';
import InfoIcon from '@mui/icons-material/Info';
// Badge 图标
import TranslateIcon from '@mui/icons-material/Translate';
import PaletteIcon from '@mui/icons-material/Palette';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NatureIcon from '@mui/icons-material/Nature';
import CreateIcon from '@mui/icons-material/Create';
import ChildCareIcon from '@mui/icons-material/ChildCare';

// SC价值映射
const scColorMapping = {
    low: { bg: '#BBDEFB', color: '#0D47A1', border: '#2196F3' },        // 30SC 蓝色
    medium: { bg: '#FFF8E1', color: '#E65100', border: '#FFC107' },     // 50SC 金色 
    high: { bg: '#FFCDD2', color: '#B71C1C', border: '#F44336' },       // 100SC 红色
};

// 分类图标映射
const getCategoryIcon = (songType) => {
    const iconMap = {
        '古风': PaletteIcon,
        '流行': TrendingUpIcon,
        '民谣': NatureIcon,
        '原创': CreateIcon,
        '儿歌': ChildCareIcon
    };
    return iconMap[songType] || CategoryIcon;
};

// 语言图标映射
const getLanguageIcon = (language) => {
    // 所有语言都使用翻译图标
    return TranslateIcon;
};

const getSCStyle = (scValue) => {
    if (!scValue) return null;
    const scNumber = parseInt(scValue);
    if (isNaN(scNumber)) {
        return scColorMapping.low; // 默认为低级别
    } else if (scNumber < 50) {
        return scColorMapping.low;
    } else if (scNumber >= 50 && scNumber < 100) {
        return scColorMapping.medium;
    } else {
        return scColorMapping.high;
    }
};
const SearchResultCard = () => {
    const dispatch = useDispatch();
    const { persistentMode, persistentKeyword, pageNum, pageSize, songs, loading } = useSelector(state => state.song);
    const copyRef = useRef();
    const observer = useRef();
    const [previousSongsCount, setPreviousSongsCount] = useState(0);

    useEffect(() => {
        if (!persistentKeyword) {
            const defaultType = "";  
            dispatch(setPersistentSearch({ mode: "type", keyword: defaultType }));
            dispatch(fetchSongsByKeyValue({ key: 'songType', value: defaultType, pageNum: 1, pageSize }));
        }
    }, [persistentKeyword, dispatch, pageSize]);

    // 跟踪歌曲数量变化，用于判断是否有新卡片
    useEffect(() => {
        if (pageNum === 1) {
            // 新搜索，重置计数，让所有卡片都播放动画
            setPreviousSongsCount(0);
        }
    }, [pageNum, persistentKeyword]); // 添加persistentKeyword依赖，确保新搜索时重置

    useEffect(() => {
        // 当歌曲加载完成且不是loading状态时，更新之前的歌曲数量
        if (!loading && songs.length > previousSongsCount) {
            setPreviousSongsCount(songs.length);
        }
    }, [loading, songs.length, previousSongsCount]);

    // 清理observer
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    // 无限滚动 - 最简化逻辑
    const lastSongElementRef = useCallback(node => {
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading && songs.length >= pageSize) {
                // 根据当前的搜索模式选择正确的key
                let searchKey = persistentMode;
                if (persistentMode === "songType") {
                    searchKey = "songType";
                } else if (persistentMode === "id") {
                    searchKey = "id";
                } else if (persistentMode === "isSuper") {
                    searchKey = "isSuper";
                }
                
                dispatch(fetchSongsByKeyValue({ 
                    key: searchKey, 
                    value: persistentKeyword, 
                    pageNum: pageNum + 1, 
                    pageSize 
                }));
            }
        }, {
            threshold: 0.5,
            rootMargin: '50px'
        });
        
        if (node) observer.current.observe(node);
    }, [loading, dispatch, persistentMode, persistentKeyword, pageNum, pageSize, songs.length]);

    const handleCardClick = (songName) => {
        if (copyRef.current) {
            copyRef.current.copy(songName);
        }
    };

    const SongCard = ({ song, index, isLast }) => {
        const hasSC = song.remarks && song.remarks.trim() !== "";
        const hasExclusive = song.info && song.info.toString().includes("专属");
        const scStyle = getSCStyle(song.remarks);
        
        // 判断是否是新加载的卡片（只对新卡片播放动画）
        const isNewCard = index >= previousSongsCount;
        const newCardIndex = isNewCard ? index - previousSongsCount : 0;
        
        // 如果是第一页，所有卡片都算新卡片，使用原始索引
        const animationIndex = pageNum === 1 ? index : newCardIndex;

        const cardProps = isLast ? { ref: lastSongElementRef } : {};

        // 动画配置：新卡片有滑入动画，旧卡片无动画
        const animationProps = isNewCard || pageNum === 1 ? {
            initial: { opacity: 0, y: 30, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: -20, scale: 0.95 },
            transition: { 
                duration: 0.4, 
                delay: animationIndex * 0.03,
                ease: "easeOut"
            }
        } : {
            initial: false, // 禁用初始动画
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { duration: 0 } // 无过渡动画
        };

        return (
            <motion.div
                {...cardProps}
                {...animationProps}
                whileHover={{ 
                    y: -2,
                    transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
            >
                <Card
                    onClick={() => handleCardClick(song.songName)}
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        background: hasSC && scStyle 
                            ? `linear-gradient(135deg, ${scStyle.bg}FF, rgba(255, 255, 255, 0.95))`
                            : hasExclusive
                                ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.15), rgba(255, 255, 255, 0.95))'
                                : 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '16px',
                        border: hasSC && scStyle 
                            ? `2px solid ${scStyle.border}AA`
                            : hasExclusive 
                                ? '2px solid #9C27B0' 
                                : '1px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: hasExclusive
                            ? '0 6px 24px rgba(156, 39, 176, 0.15)'
                            : hasSC && scStyle
                                ? `0 6px 24px ${scStyle?.color}20`
                                : '0 6px 24px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            background: hasSC && scStyle 
                                ? `linear-gradient(135deg, ${scStyle.bg}FF, rgba(255, 255, 255, 0.98))`
                                : hasExclusive
                                    ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(255, 255, 255, 0.98))'
                                    : 'rgba(255, 255, 255, 0.95)',
                            boxShadow: hasExclusive
                                ? '0 12px 40px rgba(156, 39, 176, 0.25)'
                                : hasSC && scStyle
                                    ? `0 12px 40px ${scStyle?.color}30`
                                    : '0 12px 40px rgba(0, 0, 0, 0.1)',
                        }
                    }}
                >
                    {/* 专属标识 */}
                    {hasExclusive && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -6,
                                right: -6,
                                background: 'linear-gradient(45deg, #9C27B0, #E91E63)',
                                borderRadius: '50%',
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                                boxShadow: '0 2px 8px rgba(156, 39, 176, 0.4)'
                            }}
                        >
                            <DiamondIcon sx={{ fontSize: 12, color: 'white' }} />
                        </Box>
                    )}

                    <CardContent sx={{ 
                        p: '16px !important', 
                        position: 'relative',
                        '&:last-child': {
                            pb: '16px !important'
                        }
                    }}>
                        {/* 装饰性背景 - 手机端和桌面端 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -8,
                                right: -4,
                                width: { 
                                    xs: hasSC ? 140 : 120, // 手机端：SC卡片背景更宽，避免截断
                                    sm: hasSC ? 160 : 140  // 桌面端：相应增大
                                }, 
                                height: { 
                                    xs: hasSC ? '75%' : '95%', // 手机端：SC卡片高度75%，普通卡片95%
                                    sm: hasSC ? '60%' : '75%'  // 桌面端：保持相同比例
                                }, 
                                opacity: {
                                    xs: 0.8,
                                    sm: 0.8
                                },
                                zIndex: 0,
                                backgroundImage: { 
                                    xs: `url(${PhoneCardBG})`, // 手机端使用PhoneCardBG
                                    // sm: `url(${MdCardBG})`
                                    sm: 'none' // 临时注释掉桌面端背景
                                },
                                backgroundSize: 'auto 100%', // 按高度缩放，保持宽高比
                                backgroundPosition: 'bottom right',
                                backgroundRepeat: 'no-repeat',
                                filter: 'grayscale(0.7) brightness(0.9)' // 所有背景图片统一灰色
                            }}
                        />
                        
                        {/* 头部信息 */}
                        <Box className="flex items-start gap-2 mb-2" sx={{ minHeight: hasSC ? { xs: 70, sm: 'auto' } : 'auto', position: 'relative', zIndex: 1 }}>
                            {/* 音乐图标 */}
                            <Box
                                sx={{
                                    backgroundColor: hasExclusive 
                                        ? 'rgba(156, 39, 176, 0.1)' 
                                        : hasSC 
                                            ? (() => {
                                                const scNumber = parseInt(song.remarks);
                                                if (isNaN(scNumber)) {
                                                    return 'rgba(33, 150, 243, 0.1)'; // 默认蓝色
                                                } else if (scNumber < 50) {
                                                    return 'rgba(13, 71, 161, 0.25)'; // 30SC 更深蓝色
                                                } else if (scNumber >= 50 && scNumber < 100) {
                                                    return 'rgba(245, 124, 0, 0.25)'; // 50SC 更深橙色
                                                } else {
                                                    return 'rgba(211, 47, 47, 0.25)'; // 100SC 更深红色
                                                }
                                            })()
                                            : 'rgba(33, 150, 243, 0.1)',
                                    borderRadius: '8px',
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    mt: 0.5,
                                    border: hasSC 
                                        ? (() => {
                                            const scNumber = parseInt(song.remarks);
                                            if (isNaN(scNumber)) {
                                                return '1px solid rgba(33, 150, 243, 0.3)'; // 默认蓝色边框
                                            } else if (scNumber < 50) {
                                                return '1px solid rgba(13, 71, 161, 0.5)'; // 30SC 更深蓝色边框
                                            } else if (scNumber >= 50 && scNumber < 100) {
                                                return '1px solid rgba(245, 124, 0, 0.5)'; // 50SC 更深橙色边框
                                            } else {
                                                return '1px solid rgba(211, 47, 47, 0.5)'; // 100SC 更深红色边框
                                            }
                                        })()
                                        : 'none'
                                }}
                            >
                                <MusicNoteIcon 
                                    sx={{ 
                                        fontSize: 16, 
                                        color: hasExclusive 
                                            ? '#9C27B0' 
                                            : hasSC 
                                                ? scStyle?.color 
                                                : '#2196F3'
                                    }} 
                                />
                            </Box>

                            {/* 歌曲信息 */}
                            <Box className="flex-1 min-w-0">
                                {/* 歌曲标题 - 支持滚动 */}
                                <Box 
                                    sx={{ 
                                        position: 'relative',
                                        overflow: 'hidden',
                                        height: song.songName.length > 15 ? '1.2em' : 'auto', // 长标题固定高度，短标题自适应
                                        mb: 0.5,
                                        '&:hover .scrolling-text': {
                                            animationPlayState: 'paused'
                                        }
                                    }}
                                >
                                    <Typography 
                                        variant="h6" 
                                        className={song.songName.length > 15 ? 'scrolling-text' : ''}
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            color: hasExclusive ? '#9C27B0' : '#1a1a1a',
                                            lineHeight: 1.2,
                                            background: hasExclusive 
                                                ? 'linear-gradient(45deg, #9C27B0, #E91E63)'
                                                : 'none',
                                            backgroundClip: hasExclusive ? 'text' : 'unset',
                                            WebkitBackgroundClip: hasExclusive ? 'text' : 'unset',
                                            WebkitTextFillColor: hasExclusive ? 'transparent' : 'inherit',
                                            ...(song.songName.length > 15 ? {
                                                animation: 'scrollText 6s ease-in-out infinite',
                                                whiteSpace: 'nowrap',
                                                display: 'inline-block',
                                                overflow: 'visible',
                                                transform: 'translateX(0)',
                                                '@keyframes scrollText': {
                                                    '0%': { transform: 'translateX(0)' },
                                                    '20%': { transform: 'translateX(0)' },
                                                    '50%': { transform: 'translateX(calc(-100% + 180px))' },
                                                    '80%': { transform: 'translateX(calc(-100% + 180px))' },
                                                    '100%': { transform: 'translateX(0)' }
                                                }
                                            } : {
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'normal'
                                            })
                                        }}
                                    >
                                        {song.songName}
                                    </Typography>
                                </Box>
                                
                                {/* 歌手信息 */}
                                {song.songOwner && (
                                    <Box className="flex items-center">
                                        <PersonIcon sx={{ fontSize: 14, color: '#9e9e9e', mr: 0.5 }} />
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#757575',
                                                fontWeight: 400,
                                                fontSize: '0.875rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {song.songOwner}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            {/* SC标签 */}
                            {hasSC && (
                                <Tooltip title={`SC价值: ${song.remarks}`} arrow>
                                    <Chip
                                        icon={<DiamondIcon sx={{ fontSize: 10 }} />}
                                        label={song.remarks}
                                        size="small"
                                        sx={{
                                            background: `linear-gradient(135deg, ${scStyle.bg}EE, ${scStyle.bg}CC)`,
                                            color: scStyle.color,
                                            border: `1px solid ${scStyle.border}80`,                            fontWeight: 700,
                            fontSize: '0.75rem',
                            height: 22,
                                            borderRadius: '10px',
                                            flexShrink: 0,
                                            boxShadow: `0 2px 8px ${scStyle.color}25`,
                                            '& .MuiChip-icon': {
                                                color: scStyle.color,
                                                fontSize: 10
                                            },
                                            '& .MuiChip-label': {
                                                paddingLeft: '4px',
                                                paddingRight: '8px'
                                            }
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Box>

                        {/* 标签区域 */}
                        <Box className="flex flex-wrap gap-1.5 mt-2" sx={{ position: 'relative', zIndex: 1 }}>                            {/* 类型标签 */}
                            {song.songType && (() => {
                                const IconComponent = getCategoryIcon(song.songType);
                                return (
                                    <Chip
                                        icon={<IconComponent sx={{ fontSize: '12px !important', color: '#2196F3' }} />}
                                        label={song.songType}
                                        size="small"
                                        sx={{
                                            background: 'rgba(33, 150, 243, 0.1)',
                                            color: '#2196F3',
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                            height: '24px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(33, 150, 243, 0.3)',
                                            transition: 'all 0.2s ease',
                                            boxShadow: 'none',
                                            minWidth: '40px',
                                            flex: '0 0 auto',
                                            '& .MuiChip-icon': {
                                                marginLeft: '8px',
                                                marginRight: '0px',
                                                color: '#2196F3'
                                            }
                                        }}
                                    />
                                );
                            })()}

                            {/* 语言标签 */}
                            {song.language && (() => {
                                const IconComponent = getLanguageIcon(song.language);
                                return (
                                    <Chip
                                        icon={<IconComponent sx={{ fontSize: '12px !important', color: '#9C27B0' }} />}
                                        label={song.language}
                                        size="small"
                                        sx={{
                                            background: 'rgba(156, 39, 176, 0.1)',
                                            color: '#9C27B0',
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                            height: '24px',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(156, 39, 176, 0.3)',
                                            transition: 'all 0.2s ease',
                                            boxShadow: 'none',
                                            minWidth: '40px',
                                            flex: '0 0 auto',
                                            '& .MuiChip-icon': {
                                                marginLeft: '8px',
                                                marginRight: '0px',
                                                color: '#9C27B0'
                                            }
                                        }}
                                    />
                                );
                            })()}

                            {/* 备注信息 */}
                            {song.info && song.info.trim() !== "" && (
                                <Chip
                                    icon={<InfoIcon sx={{ fontSize: 10 }} />}
                                    label={song.info}
                                    size="small"
                                    sx={{
                                        background: hasExclusive 
                                            ? 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))' 
                                            : 'linear-gradient(135deg, rgba(158, 158, 158, 0.08), rgba(158, 158, 158, 0.03))',
                                        borderColor: hasExclusive 
                                            ? 'rgba(156, 39, 176, 0.3)' 
                                            : 'rgba(158, 158, 158, 0.3)',
                                        color: hasExclusive ? '#7B1FA2' : '#616161',
                                        fontSize: '0.7rem',
                                        height: 20,
                                        borderRadius: '10px',
                                        fontWeight: 600,
                                        border: `1px solid ${hasExclusive ? 'rgba(156, 39, 176, 0.3)' : 'rgba(158, 158, 158, 0.3)'}`,
                                        '& .MuiChip-icon': {
                                            color: hasExclusive ? '#7B1FA2' : '#616161',
                                            fontSize: 10
                                        },
                                        '& .MuiChip-label': {
                                            paddingLeft: '4px',
                                            paddingRight: '6px'
                                        }
                                    }}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    return (
        <>
            <Box>
                {songs.length > 0 ? (
                    <Grid container spacing={2}>
                        <AnimatePresence mode="popLayout">
                            {songs.map((song, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={`${song.id}-${index}`}>
                                    <SongCard 
                                        song={song} 
                                        index={index}
                                        isLast={songs.length === index + 1}
                                    />
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>
                ) : !loading && (
                    <Fade in={true}>
                        <Box 
                            sx={{
                                textAlign: 'center',
                                py: 6,
                                px: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                mt: 4
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                    borderRadius: '50%',
                                    width: 80,
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3,
                                    border: '2px solid rgba(33, 150, 243, 0.2)'
                                }}
                            >
                                <MusicNoteIcon 
                                    sx={{ 
                                        fontSize: 40, 
                                        color: '#2196F3',
                                        opacity: 0.8
                                    }} 
                                />
                            </Box>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    mb: 1
                                }}
                            >
                                暂无搜索结果
                            </Typography>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    color: '#757575',
                                    lineHeight: 1.6,
                                    fontWeight: 400
                                }}
                            >
                                试试其他关键词或分类筛选
                            </Typography>
                        </Box>
                    </Fade>
                )}

                {loading && (
                    <Box 
                        sx={{
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            py: 4
                        }}
                    >
                        <CircularProgress 
                            size={32} 
                            sx={{ 
                                color: '#2196F3'
                            }} 
                        />
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                ml: 2, 
                                color: '#757575',
                                fontWeight: 500
                            }}
                        >
                            加载中...
                        </Typography>
                    </Box>
                )}
            </Box>
            <CopyToClipboardSnackbar ref={copyRef} />
        </>
    );
};

export default SearchResultCard;
