import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Typography,
    Box,
    Avatar,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    Divider,
} from '@mui/material';
import {
    Close as CloseIcon,
    MusicNote as MusicNoteIcon,
    Person as PersonIcon,
    Album as AlbumIcon,
    AccessTime as AccessTimeIcon,
    Lyrics as LyricsIcon,
    Category as CategoryIcon,
    Diamond as DiamondIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    Stop as StopIcon,
    // Badge 图标 - 与SearchResultCard保持一致
    Translate as TranslateIcon,
    Palette as PaletteIcon,
    TrendingUp as TrendingUpIcon,
    Nature as NatureIcon,
    Create as CreateIcon,
    ChildCare as ChildCareIcon,
    Info as InfoIcon,
    VideoLibrary as VideoLibraryIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getSongDetails } from '../services/API/backend/songApi';
import config from '../config/config.dev.js';
import barAvatar from '../assets/barAvatar.png';

// 紧凑的B站视频卡片组件
const CompactBilibiliVideoCard = ({ video, index = 0 }) => {
    // 格式化播放量
    const formatView = (view) => {
        if (view >= 10000) {
            return (view / 10000).toFixed(1) + '万';
        }
        return view.toString();
    };

    // 打开B站视频
    const openVideo = () => {
        window.open(`https://www.bilibili.com/video/${video.bv}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(233, 30, 99, 0.06)',
                    border: '1px solid rgba(233, 30, 99, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(233, 30, 99, 0.1)',
                        borderColor: 'rgba(233, 30, 99, 0.25)'
                    }
                }}
                onClick={openVideo}
            >
                {/* 封面和BV号组合 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                    {/* 视频封面 - 放大尺寸 */}
                    <Box
                        sx={{
                            width: 80,  // 放大封面宽度
                            height: 45, // 放大封面高度，保持16:9比例
                            borderRadius: '4px',
                            overflow: 'hidden',
                            backgroundColor: '#f5f5f5',
                            position: 'relative',
                            border: '1px solid rgba(233, 30, 99, 0.2)'
                        }}
                    >
                        {video.cover ? (
                            <img
                                src={video.cover}
                                alt={video.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const fallbackDiv = e.target.parentNode.querySelector('.fallback-icon');
                                    if (fallbackDiv) {
                                        fallbackDiv.style.display = 'flex';
                                    }
                                }}
                            />
                        ) : null}
                        <Box
                            className="fallback-icon"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: video.cover ? 'none' : 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f0f0f0'
                            }}
                        >
                            <VideoLibraryIcon sx={{ fontSize: 16, color: '#999' }} />
                        </Box>
                    </Box>

                    {/* BV号标识 - 放大以显示完整ID */}
                    <Box
                        sx={{
                            backgroundColor: '#e91e63',
                            color: 'white',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: '3px',
                            fontSize: '8px',
                            fontWeight: 600,
                            lineHeight: 1,
                            letterSpacing: '0.3px',
                            maxWidth: 80, // 与封面宽度一致
                            minWidth: 'fit-content',
                            textAlign: 'center'
                        }}
                    >
                        {video.bv || 'BV'}
                    </Box>
                </Box>

                {/* 视频信息 */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            lineHeight: 1.2,
                            mb: 1, // 保持与作者行的间距
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // 显示两行
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {video.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                        {/* 作者 */}
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {video.author}
                        </Typography>

                        {/* 播放量 */}
                        {video.view > 0 && (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.25,
                                px: 0.5,
                                py: 0.125,
                                borderRadius: '2px',
                                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                                border: '1px solid rgba(108, 117, 125, 0.2)'
                            }}>
                                <VisibilityIcon sx={{ fontSize: 8, color: '#6c757d' }} />
                                <Typography variant="caption" sx={{ 
                                    fontSize: '8px',
                                    fontWeight: 500,
                                    color: '#6c757d',
                                    lineHeight: 1
                                }}>
                                    {formatView(video.view)}
                                </Typography>
                            </Box>
                        )}

                        {/* 时长 */}
                        {video.duration && (
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.25,
                                px: 0.5,
                                py: 0.125,
                                borderRadius: '2px',
                                backgroundColor: 'rgba(233, 30, 99, 0.1)',
                                border: '1px solid rgba(233, 30, 99, 0.2)'
                            }}>
                                <AccessTimeIcon sx={{ fontSize: 8, color: '#e91e63' }} />
                                <Typography variant="caption" sx={{ 
                                    fontSize: '8px',
                                    fontWeight: 500,
                                    color: '#e91e63',
                                    lineHeight: 1
                                }}>
                                    {video.duration}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
};

const MusicDetailsModal = ({ open, onClose, songId }) => {
    const [songDetails, setSongDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 播放相关状态
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
    const [playStartTime, setPlayStartTime] = useState(null);

    // 歌词容器引用
    const lyricsContainerRef = React.useRef(null);

    // 获取歌曲详情
    useEffect(() => {
        if (open && songId) {
            fetchSongDetails();
        }
    }, [open, songId]);

    const fetchSongDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSongDetails(songId);

            if (response.code === 200) {
                setSongDetails(response.data);
            } else {
                setError(response.msg || '获取歌曲详情失败');
            }
        } catch (err) {
            setError('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // SC价值映射 - 与SearchResultCard保持一致
    const scColorMapping = {
        low: { bg: '#BBDEFB', color: '#0D47A1', border: '#2196F3' },        // 30SC 蓝色
        medium: { bg: '#FFF8E1', color: '#E65100', border: '#FFC107' },     // 50SC 金色 
        high: { bg: '#FFCDD2', color: '#B71C1C', border: '#F44336' },       // 100SC 红色
    };

    // 分类图标映射 - 与SearchResultCard保持一致
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

    // 语言图标映射 - 与SearchResultCard保持一致
    const getLanguageIcon = (language) => {
        // 所有语言都使用翻译图标
        return TranslateIcon;
    };

    const getSCStyle = (scValue) => {
        if (!scValue) return null;

        // 提取数字部分，支持"50SC"、"50"等格式
        const scMatch = scValue.toString().match(/\d+/);
        if (!scMatch) return null;

        const scNumber = parseInt(scMatch[0]);
        if (isNaN(scNumber)) {
            return null;
        } else if (scNumber < 50) {
            return scColorMapping.low;
        } else if (scNumber >= 50 && scNumber < 100) {
            return scColorMapping.medium;
        } else {
            return scColorMapping.high;
        }
    };

    // 格式化时长
    const formatDuration = (seconds) => {
        if (!seconds) return '未知';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 解析LRC歌词格式
    const parseLyrics = (lyrics) => {
        if (!lyrics) return { metadata: {}, lines: [] };

        const metadata = {};
        const lines = [];

        const lrcLines = lyrics.split('\n');

        lrcLines.forEach(line => {
            line = line.trim();
            if (!line) return;

            // 解析元数据标签 [ti:title] [ar:artist] [al:album] [by:author] [offset:offset]
            const metaMatch = line.match(/^\[(\w+):(.+)\]$/);
            if (metaMatch) {
                const [, key, value] = metaMatch;
                metadata[key] = value.trim();
                return;
            }

            // 改进的时间戳解析 - 支持多种格式
            // 支持格式: [mm:ss.xx], [m:ss.xx], [mm:ss.xxx], [m:ss.xxx], [mm:ss], [m:ss]
            const timeMatch = line.match(/^\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\](.*)$/);
            if (timeMatch) {
                const [, minutes, seconds, centiseconds = '0', text] = timeMatch;
                // 处理不同长度的毫秒部分
                let cs = parseInt(centiseconds);
                if (centiseconds.length === 3) {
                    cs = cs / 10; // 将毫秒转换为厘秒
                }
                const timeInSeconds = parseInt(minutes) * 60 + parseInt(seconds) + cs / 100;

                // 即使文本为空也要添加，用于处理空行或间隔
                lines.push({
                    time: timeInSeconds,
                    timeText: `${minutes.padStart(2, '0')}:${seconds}`,
                    text: text.trim() || ' ' // 空文本用空格代替，避免完全空白
                });
                return;
            }

            // 处理没有时间戳的歌词行
            if (line && !line.startsWith('[')) {
                lines.push({
                    time: null,
                    timeText: null,
                    text: line
                });
            }
        });

        // 按时间排序，并处理相同时间戳的情况
        lines.sort((a, b) => {
            if (a.time === null && b.time === null) return 0;
            if (a.time === null) return 1;
            if (b.time === null) return -1;
            return a.time - b.time;
        });

        // 为相同时间戳的歌词添加微小的时间差，确保正确排序和显示
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].time !== null && lines[i - 1].time !== null &&
                Math.abs(lines[i].time - lines[i - 1].time) < 0.01) {
                lines[i].time = lines[i - 1].time + 0.01;
            }
        }

        return { metadata, lines };
    };

    // 格式化时间显示
    const formatTime = (seconds) => {
        if (seconds === null || seconds === undefined) return '';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 播放控制函数
    const handlePlayPause = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setPlayStartTime(null);
        } else {
            setIsPlaying(true);
            setPlayStartTime(Date.now() - currentTime * 1000);
        }
    };

    const handleStop = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentLyricIndex(-1);
        setPlayStartTime(null);
    };

    // 播放时间更新
    useEffect(() => {
        let interval = null;
        if (isPlaying && playStartTime) {
            interval = setInterval(() => {
                const elapsed = (Date.now() - playStartTime) / 1000;
                setCurrentTime(elapsed);
            }, 100);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, playStartTime]);

    // 获取当前应该高亮的歌词索引数组（支持同时高亮多行）
    const getCurrentLyricIndices = (lines, currentTime) => {
        if (!lines || lines.length === 0) return [];

        let activeIndices = [];
        let currentActiveTime = null;

        // 找到当前时间对应的歌词时间戳
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.time === null) continue;

            if (line.time <= currentTime + 0.1) {
                currentActiveTime = line.time;
            } else {
                break;
            }
        }

        // 如果找到了当前活跃的时间戳，找出所有相同时间戳的歌词
        if (currentActiveTime !== null) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.time !== null && Math.abs(line.time - currentActiveTime) < 0.05) {
                    activeIndices.push(i);
                }
            }
        }

        return activeIndices;
    };

    // 当前高亮的歌词索引数组
    const [currentLyricIndices, setCurrentLyricIndices] = useState([]);

    // 浮动播放控制条状态
    const [showFloatingControls, setShowFloatingControls] = useState(false);
    const playbackControlsRef = React.useRef(null);

    // 更新当前歌词索引数组
    useEffect(() => {
        if (songDetails?.lyrics && currentTime >= 0) {
            const { lines } = parseLyrics(songDetails.lyrics);
            const newIndices = getCurrentLyricIndices(lines, currentTime);

            // 使用函数式更新来避免依赖currentLyricIndices
            setCurrentLyricIndices(prevIndices => {
                // 比较数组是否相同
                const arraysEqual = (a, b) => {
                    if (a.length !== b.length) return false;
                    return a.every((val, index) => val === b[index]);
                };

                if (!arraysEqual(newIndices, prevIndices)) {
                    // 为了兼容原有的滚动逻辑，设置主要索引
                    setCurrentLyricIndex(newIndices.length > 0 ? newIndices[0] : -1);
                    return newIndices;
                }
                return prevIndices;
            });
        } else if (currentTime === 0) {
            setCurrentLyricIndices([]);
            setCurrentLyricIndex(-1);
        }
    }, [currentTime, songDetails?.lyrics]);

    // 自动滚动到当前歌词行 - 修复手机端问题
    useEffect(() => {
        if (currentLyricIndex >= 0 && lyricsContainerRef.current && isPlaying) {
            // 添加延迟以确保DOM已更新
            const scrollTimeout = setTimeout(() => {
                const container = lyricsContainerRef.current;
                const currentElement = container.querySelector(`[data-lyric-index="${currentLyricIndex}"]`);

                if (currentElement && container) {
                    // 检测是否为手机端
                    const isMobile = window.innerWidth < 900; // md breakpoint

                    if (isMobile) {
                        // 手机端：直接滚动到元素，不做可视性检查
                        currentElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'nearest'
                        });
                    } else {
                        // 桌面端：保持原有的可视性检查逻辑
                        const containerRect = container.getBoundingClientRect();
                        const elementRect = currentElement.getBoundingClientRect();

                        // 检查元素是否在可视区域内
                        const isVisible = (
                            elementRect.top >= containerRect.top &&
                            elementRect.bottom <= containerRect.bottom
                        );

                        // 只有当元素不在可视区域时才滚动
                        if (!isVisible) {
                            currentElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                                inline: 'nearest'
                            });
                        }
                    }
                }
            }, 150); // 手机端增加延迟时间确保布局稳定

            return () => clearTimeout(scrollTimeout);
        }
    }, [currentLyricIndex, isPlaying]);

    // 检测播放控制按钮是否在可视区域内
    useEffect(() => {
        const checkControlsVisibility = () => {
            if (playbackControlsRef.current && isPlaying) {
                const controlsRect = playbackControlsRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                // 检查控制按钮是否在可视区域内
                const isVisible = (
                    controlsRect.top >= 0 &&
                    controlsRect.bottom <= viewportHeight
                );

                setShowFloatingControls(!isVisible);
            } else {
                setShowFloatingControls(false);
            }
        };

        // 初始检查
        checkControlsVisibility();

        // 监听滚动事件
        const handleScroll = () => {
            checkControlsVisibility();
        };

        // 添加滚动监听器
        window.addEventListener('scroll', handleScroll, true); // 使用捕获模式监听所有滚动

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isPlaying]);

    // 关闭时重置播放状态
    const handleClose = () => {
        setSongDetails(null);
        setError(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentLyricIndex(-1);
        setPlayStartTime(null);
        onClose();
    };



    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    background: (() => {
                        if (!songDetails) return 'rgba(255, 255, 255, 0.98)';
                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                        const scStyle = getSCStyle(songDetails.remarks);

                        if (hasSC && scStyle) {
                            return `linear-gradient(135deg, ${scStyle.bg}, rgba(255, 255, 255, 0.95))`;
                        } else if (hasExclusive) {
                            return 'linear-gradient(135deg, rgba(156, 39, 176, 0.15), rgba(255, 255, 255, 0.95))';
                        }
                        return 'rgba(255, 255, 255, 0.98)';
                    })(),
                    backdropFilter: 'none',
                    boxShadow: (() => {
                        if (!songDetails) return '0 16px 32px rgba(0, 0, 0, 0.12)';
                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                        const scStyle = getSCStyle(songDetails.remarks);

                        if (hasSC && scStyle) {
                            return `0 16px 32px ${scStyle.color}15`;
                        } else if (hasExclusive) {
                            return '0 16px 32px rgba(156, 39, 176, 0.15)';
                        }
                        return '0 16px 32px rgba(0, 0, 0, 0.12)';
                    })(),
                    maxHeight: '80vh',
                    border: (() => {
                        if (!songDetails) return '1px solid rgba(255, 255, 255, 0.2)';
                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                        const scStyle = getSCStyle(songDetails.remarks);

                        if (hasSC && scStyle) {
                            return `1px solid ${scStyle.border}40`;
                        } else if (hasExclusive) {
                            return '1px solid rgba(156, 39, 176, 0.3)';
                        }
                        return '1px solid rgba(255, 255, 255, 0.2)';
                    })(),
                    overflow: 'hidden',
                    minHeight: '500px'
                }
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'none'
                    }
                }
            }}
        >
            {/* 简洁标题栏 */}
            <Box sx={{
                background: (() => {
                    if (!songDetails) return 'rgba(255, 255, 255, 0.95)';
                    const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                    const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                    const scStyle = getSCStyle(songDetails.remarks);

                    if (hasSC && scStyle) {
                        return `linear-gradient(135deg, ${scStyle.bg}90, rgba(255, 255, 255, 0.95))`;
                    } else if (hasExclusive) {
                        return 'linear-gradient(135deg, rgba(156, 39, 176, 0.18), rgba(255, 255, 255, 0.95))';
                    }
                    return 'rgba(255, 255, 255, 0.95)';
                })(),
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Box
                        sx={{
                            backgroundColor: (() => {
                                if (!songDetails) return 'rgba(33, 150, 243, 0.1)';
                                const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                const scStyle = getSCStyle(songDetails.remarks);

                                if (hasSC && scStyle) {
                                    return `${scStyle.bg}40`;
                                } else if (hasExclusive) {
                                    return 'rgba(156, 39, 176, 0.1)';
                                }
                                return 'rgba(33, 150, 243, 0.1)';
                            })(),
                            borderRadius: '10px',
                            p: 0.8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <MusicNoteIcon sx={{
                            color: (() => {
                                if (!songDetails) return '#2196F3';
                                const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                const scStyle = getSCStyle(songDetails.remarks);

                                if (hasSC && scStyle) {
                                    return scStyle.color;
                                } else if (hasExclusive) {
                                    return '#9C27B0';
                                }
                                return '#2196F3';
                            })(),
                            fontSize: 18
                        }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1a1a1a', fontSize: '1rem' }}>
                        音乐详情
                    </Typography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        color: '#757575',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        borderRadius: '10px',
                        width: 32,
                        height: 32,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            color: '#424242'
                        }
                    }}
                >
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                py={8}
                                sx={{
                                    minHeight: '400px'
                                }}
                            >
                                <CircularProgress
                                    size={48}
                                    sx={{
                                        color: '#2196F3',
                                        mr: 2
                                    }}
                                />
                                <Typography variant="h6" sx={{ color: '#424242', fontWeight: 500 }}>
                                    加载中...
                                </Typography>
                            </Box>
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Box
                                textAlign="center"
                                py={6}
                                sx={{
                                    minHeight: '400px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Typography variant="h5" color="error" gutterBottom fontWeight={600}>
                                    加载失败
                                </Typography>
                                <Typography variant="body1" color="text.secondary" mb={3}>
                                    {error}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={fetchSongDetails}
                                    sx={{
                                        backgroundColor: '#2196F3',
                                        borderRadius: '12px',
                                        px: 3,
                                        py: 1.5,
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: '#1976D2'
                                        }
                                    }}
                                >
                                    重试
                                </Button>
                            </Box>
                        </motion.div>
                    ) : songDetails ? (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {/* 主内容区域 - 修复手机端布局 */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                height: { xs: 'calc(80vh - 60px)', md: 'calc(80vh - 60px)' },
                                maxHeight: { xs: 'calc(80vh - 60px)', md: 'calc(80vh - 60px)' },
                                overflow: { xs: 'auto', md: 'hidden' } // 手机端统一滚动，桌面端分别滚动
                            }}>
                                {/* 左侧：歌曲详情 */}
                                <Box sx={{
                                    flex: { xs: 'none', md: '0 0 320px' },
                                    p: 2.5,
                                    borderRight: { xs: 'none', md: '1px solid rgba(0, 0, 0, 0.06)' },
                                    borderBottom: { xs: '1px solid rgba(0, 0, 0, 0.06)', md: 'none' },
                                    overflow: { xs: 'visible', md: 'auto' }, // 手机端不单独滚动
                                    maxHeight: { xs: 'none', md: 'none' }, // 手机端去除高度限制
                                    minHeight: { xs: 'auto', md: 'auto' }
                                }}>
                                    {/* 歌曲封面 */}
                                    <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                                        <Avatar
                                            src={songDetails.coverUrl}
                                            sx={{
                                                width: { xs: 120, md: 140 },
                                                height: { xs: 120, md: 140 },
                                                mx: 'auto',
                                                mb: 1.5,
                                                borderRadius: '16px',
                                                boxShadow: (() => {
                                                    const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                    const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                    const scStyle = getSCStyle(songDetails.remarks);

                                                    if (hasSC && scStyle) {
                                                        return `0 8px 24px ${scStyle.color}25`;
                                                    } else if (hasExclusive) {
                                                        return '0 8px 24px rgba(156, 39, 176, 0.25)';
                                                    }
                                                    return '0 8px 24px rgba(0, 0, 0, 0.15)';
                                                })(),
                                                border: (() => {
                                                    const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                    const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                    const scStyle = getSCStyle(songDetails.remarks);

                                                    if (hasSC && scStyle) {
                                                        return `2px solid ${scStyle.border}60`;
                                                    } else if (hasExclusive) {
                                                        return '2px solid rgba(156, 39, 176, 0.4)';
                                                    }
                                                    return '1px solid rgba(255, 255, 255, 0.2)';
                                                })()
                                            }}
                                        >
                                            <MusicNoteIcon sx={{
                                                fontSize: 48,
                                                color: (() => {
                                                    const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                    const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                    const scStyle = getSCStyle(songDetails.remarks);

                                                    if (hasSC && scStyle) {
                                                        return scStyle.color;
                                                    } else if (hasExclusive) {
                                                        return '#9C27B0';
                                                    }
                                                    return '#2196F3';
                                                })()
                                            }} />
                                        </Avatar>
                                    </Box>

                                    {/* 歌曲基本信息 */}
                                    <Box sx={{ mb: 2.5 }}>
                                        {/* 歌曲名称 */}
                                        <Typography
                                            variant="h5"
                                            fontWeight={700}
                                            gutterBottom
                                            sx={{
                                                mb: 1,
                                                color: (() => {
                                                    const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                    const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                    const scStyle = getSCStyle(songDetails.remarks);

                                                    if (hasSC && scStyle) {
                                                        return scStyle.color;
                                                    } else if (hasExclusive) {
                                                        return '#9C27B0';
                                                    }
                                                    return '#1a1a1a';
                                                })(),
                                                wordBreak: 'break-word',
                                                textAlign: 'center',
                                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                            }}
                                        >
                                            {songDetails.songName || '未知歌曲'}
                                        </Typography>

                                        {/* 艺术家 */}
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                                            <PersonIcon sx={{
                                                color: (() => {
                                                    const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                    const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                    const scStyle = getSCStyle(songDetails.remarks);

                                                    if (hasSC && scStyle) {
                                                        return scStyle.color;
                                                    } else if (hasExclusive) {
                                                        return '#9C27B0';
                                                    }
                                                    return '#2196F3';
                                                })(),
                                                fontSize: 18
                                            }} />
                                            <Typography
                                                variant="subtitle1"
                                                color="text.secondary"
                                                fontWeight={500}
                                                sx={{ textAlign: 'center', fontSize: '1rem' }}
                                            >
                                                {songDetails.songOwner || '未知艺术家'}
                                            </Typography>
                                        </Box>

                                        {/* SC Superchat样式条 - 重新设计的布局 */}
                                        {songDetails.remarks && songDetails.remarks.trim() !== "" && (
                                            <Box sx={{ mb: 2.5 }}>
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                >
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            background: (() => {
                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                if (scStyle) {
                                                                    // 使用渐变背景增强视觉效果
                                                                    return `linear-gradient(135deg, ${scStyle.bg}, ${scStyle.bg}E0)`;
                                                                }
                                                                return 'linear-gradient(135deg, #BBDEFB, #BBDEFBE0)';
                                                            })(),
                                                            borderRadius: { xs: '10px', sm: '12px' },
                                                            boxShadow: (() => {
                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                if (scStyle) {
                                                                    // 主题色阴影增强视觉层次 - 移动端减少阴影
                                                                    return {
                                                                        xs: `0 2px 8px ${scStyle.color}15, 0 1px 4px ${scStyle.color}10`,
                                                                        sm: `0 4px 16px ${scStyle.color}20, 0 2px 8px ${scStyle.color}15`
                                                                    };
                                                                }
                                                                return {
                                                                    xs: '0 2px 8px rgba(33, 150, 243, 0.15), 0 1px 4px rgba(33, 150, 243, 0.1)',
                                                                    sm: '0 4px 16px rgba(33, 150, 243, 0.2), 0 2px 8px rgba(33, 150, 243, 0.15)'
                                                                };
                                                            })(),
                                                            overflow: 'hidden',
                                                            position: 'relative',
                                                            border: (() => {
                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                if (scStyle) {
                                                                    return `1.5px solid ${scStyle.border}60`;
                                                                }
                                                                return '1.5px solid rgba(33, 150, 243, 0.6)';
                                                            })(),
                                                            // 添加微妙的内阴影
                                                            '&::before': {
                                                                content: '""',
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                height: '1px',
                                                                background: 'rgba(255, 255, 255, 0.3)',
                                                                zIndex: 1
                                                            }
                                                        }}
                                                    >
                                                        {/* 重新设计的SC头部区域 - 修复宽度挤压问题 */}
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            px: { xs: 1, sm: 1.5 },
                                                            py: { xs: 0.5, sm: 0.75 },
                                                            width: '100%', // 确保占满宽度
                                                            minWidth: 0, // 防止内容溢出
                                                            overflow: 'visible', // 确保内容可见
                                                            background: (() => {
                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                if (scStyle) {
                                                                    // 头部使用主题色的半透明背景
                                                                    return `linear-gradient(135deg, ${scStyle.color}08, rgba(255,255,255,0.15))`;
                                                                }
                                                                return 'linear-gradient(135deg, rgba(13, 71, 161, 0.08), rgba(255,255,255,0.15))';
                                                            })(),
                                                            borderBottom: (() => {
                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                if (scStyle) {
                                                                    return `1px solid ${scStyle.border}25`;
                                                                }
                                                                return '1px solid rgba(33, 150, 243, 0.25)';
                                                            })()
                                                        }}>
                                                            {/* 左侧：头像和用户名 - 修复宽度挤压 */}
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: { xs: 0.75, sm: 1 },
                                                                flex: 'none', // 不要弹性伸缩
                                                                width: 'auto' // 自动宽度
                                                            }}>
                                                                {/* 用户头像 - 使用本地头像 */}
                                                                <Box sx={{
                                                                    width: { xs: 24, sm: 28 },
                                                                    height: { xs: 24, sm: 28 },
                                                                    flexShrink: 0
                                                                }}>
                                                                    <Avatar
                                                                        src={barAvatar}
                                                                        alt={config.anchorInfo.fanTag}
                                                                        sx={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            border: (() => {
                                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                                if (scStyle) {
                                                                                    return `1px solid ${scStyle.color}`;
                                                                                }
                                                                                return '1px solid rgba(13, 71, 161, 0.6)';
                                                                            })()
                                                                        }}
                                                                    />
                                                                </Box>
                                                                {/* 用户名 - 使用配置中的fanTag */}
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: (() => {
                                                                            const scStyle = getSCStyle(songDetails.remarks);
                                                                            if (scStyle) {
                                                                                return scStyle.color;
                                                                            }
                                                                            return 'rgba(13, 71, 161, 0.8)';
                                                                        })(),
                                                                        fontWeight: 600,
                                                                        fontSize: { xs: '0.75rem', sm: '0.8rem' },
                                                                        lineHeight: 1,
                                                                        whiteSpace: 'nowrap',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        maxWidth: { xs: 60, sm: 80 }
                                                                    }}
                                                                >
                                                                    {config.anchorInfo.fanTag}
                                                                </Typography>
                                                            </Box>

                                                            {/* 右侧：价格信息 - 紧凑布局 */}
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                flexShrink: 0
                                                            }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.25, sm: 0.5 } }}>
                                                                    <Typography variant="body2" sx={{
                                                                        color: getSCStyle(songDetails.remarks)?.color || '#0D47A1',
                                                                        fontWeight: 600,
                                                                        fontSize: { xs: '12px', sm: '14px' },
                                                                        textShadow: (() => {
                                                                            const scStyle = getSCStyle(songDetails.remarks);
                                                                            if (scStyle) {
                                                                                return `0 1px 2px ${scStyle.color}20`;
                                                                            }
                                                                            return '0 1px 2px rgba(13, 71, 161, 0.2)';
                                                                        })()
                                                                    }}>
                                                                        ¥{songDetails.remarks.replace("SC", "")}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{
                                                                        color: getSCStyle(songDetails.remarks)?.color || '#0D47A1',
                                                                        fontSize: { xs: '9px', sm: '11px' },
                                                                        fontWeight: 400,
                                                                        opacity: 0.85,
                                                                        display: { xs: 'none', sm: 'inline' },
                                                                        textShadow: (() => {
                                                                            const scStyle = getSCStyle(songDetails.remarks);
                                                                            if (scStyle) {
                                                                                return `0 1px 2px ${scStyle.color}15`;
                                                                            }
                                                                            return '0 1px 2px rgba(13, 71, 161, 0.15)';
                                                                        })()
                                                                    }}>
                                                                        ({parseInt(songDetails.remarks) * 10} 电池)
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                        {/* 消息内容区域 - 使用对应SC颜色的深色版本 */}
                                                        <Box sx={{
                                                            px: { xs: 1.5, sm: 2 },
                                                            py: { xs: 1.25, sm: 1.5 },
                                                            background: (() => {
                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                if (scStyle) {
                                                                    // 使用对应SC颜色的深色纯色版本
                                                                    if (scStyle.color === '#0D47A1') { // 蓝色 (30SC)
                                                                        return '#0D47A1';
                                                                    } else if (scStyle.color === '#E65100') { // 金色 (50SC)
                                                                        return '#E65100';
                                                                    } else if (scStyle.color === '#B71C1C') { // 红色 (100SC)
                                                                        return '#B71C1C';
                                                                    }
                                                                    return scStyle.color;
                                                                }
                                                                return '#0D47A1';
                                                            })(),
                                                            borderTop: (() => {
                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                if (scStyle) {
                                                                    return `1px solid ${scStyle.border}30`;
                                                                }
                                                                return '1px solid rgba(33, 150, 243, 0.3)';
                                                            })(),
                                                            borderRadius: '0 0 12px 12px',
                                                            // 添加内阴影增强深度
                                                            boxShadow: (() => {
                                                                const scStyle = getSCStyle(songDetails.remarks);
                                                                if (scStyle) {
                                                                    return `inset 0 2px 4px ${scStyle.color}30, 0 1px 2px ${scStyle.color}20`;
                                                                }
                                                                return 'inset 0 2px 4px rgba(13, 71, 161, 0.3), 0 1px 2px rgba(13, 71, 161, 0.2)';
                                                            })()
                                                        }}>
                                                            <Typography variant="body2" sx={{
                                                                color: '#ffffff', // 白色文字
                                                                fontWeight: 500,
                                                                fontSize: { xs: '13px', sm: '14px' },
                                                                lineHeight: { xs: 1.4, sm: 1.5 },
                                                                textAlign: 'left',
                                                                wordBreak: 'break-word',
                                                                textShadow: (() => {
                                                                    const scStyle = getSCStyle(songDetails.remarks);
                                                                    if (scStyle) {
                                                                        return `0 1px 2px ${scStyle.color}80`;
                                                                    }
                                                                    return '0 1px 2px rgba(13, 71, 161, 0.8)';
                                                                })(),
                                                                filter: 'none'
                                                            }}>
                                                                点歌 {songDetails.songName}
                                                            </Typography>
                                                        </Box>
                                                    </Paper>
                                                </motion.div>
                                            </Box>
                                        )}

                                        {/* 其他标签区域 */}
                                        <Box display="flex" flexWrap="wrap" gap={1} mb={2} justifyContent="center">
                                            {/* 专属标签 */}
                                            {songDetails.info && songDetails.info.toString().includes("专属") && (
                                                <Chip
                                                    label="专属"
                                                    icon={<DiamondIcon sx={{ fontSize: '14px !important' }} />}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                                        color: '#9C27B0',
                                                        border: '1px solid #9C27B0',
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem',
                                                        height: '24px'
                                                    }}
                                                />
                                            )}

                                            {/* 类型标签 - 与SearchResultCard保持一致 */}
                                            {songDetails.songType && (() => {
                                                const IconComponent = getCategoryIcon(songDetails.songType);
                                                return (
                                                    <Chip
                                                        icon={<IconComponent sx={{ fontSize: '12px !important', color: '#2196F3' }} />}
                                                        label={songDetails.songType}
                                                        size="small"
                                                        sx={{
                                                            background: 'rgba(33, 150, 243, 0.1)',
                                                            color: '#2196F3',
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            height: '24px',
                                                            borderRadius: '12px',
                                                            border: '1px solid rgba(33, 150, 243, 0.3)',
                                                            '& .MuiChip-icon': {
                                                                marginLeft: '8px',
                                                                marginRight: '0px',
                                                                color: '#2196F3'
                                                            }
                                                        }}
                                                    />
                                                );
                                            })()}

                                            {/* 语言标签 - 与SearchResultCard保持一致 */}
                                            {songDetails.language && (() => {
                                                const IconComponent = getLanguageIcon(songDetails.language);
                                                return (
                                                    <Chip
                                                        icon={<IconComponent sx={{ fontSize: '12px !important', color: '#9C27B0' }} />}
                                                        label={songDetails.language}
                                                        size="small"
                                                        sx={{
                                                            background: 'rgba(156, 39, 176, 0.1)',
                                                            color: '#9C27B0',
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            height: '24px',
                                                            borderRadius: '12px',
                                                            border: '1px solid rgba(156, 39, 176, 0.3)',
                                                            '& .MuiChip-icon': {
                                                                marginLeft: '8px',
                                                                marginRight: '0px',
                                                                color: '#9C27B0'
                                                            }
                                                        }}
                                                    />
                                                );
                                            })()}

                                            {/* 备注信息 - 与SearchResultCard保持一致 */}
                                            {songDetails.info && songDetails.info.trim() !== "" && !songDetails.info.toString().includes("专属") && (
                                                <Chip
                                                    icon={<InfoIcon sx={{ fontSize: 10 }} />}
                                                    label={songDetails.info}
                                                    size="small"
                                                    sx={{
                                                        background: 'linear-gradient(135deg, rgba(158, 158, 158, 0.08), rgba(158, 158, 158, 0.03))',
                                                        borderColor: 'rgba(158, 158, 158, 0.3)',
                                                        color: '#616161',
                                                        fontSize: '0.7rem',
                                                        height: 20,
                                                        borderRadius: '10px',
                                                        fontWeight: 600,
                                                        border: '1px solid rgba(158, 158, 158, 0.3)',
                                                        '& .MuiChip-icon': {
                                                            color: '#616161',
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

                                    </Box>

                                    <Divider sx={{ mb: 2, opacity: 0.3 }} />

                                    {/* 详细信息区域 */}
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600} sx={{
                                            color: '#757575',
                                            mb: 1.5,
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}>
                                            <InfoIcon sx={{ fontSize: 16 }} />
                                            详细信息
                                        </Typography>

                                        <Stack spacing={1.5}>
                                            {/* 专辑信息 */}
                                            <Box 
                                                display="flex" 
                                                alignItems="center" 
                                                gap={1.5}
                                                sx={{
                                                    backgroundColor: (() => {
                                                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                        const scStyle = getSCStyle(songDetails.remarks);

                                                        if (hasSC && scStyle) {
                                                            return `${scStyle.bg}40`; // SC主题色背景，40%透明度
                                                        } else if (hasExclusive) {
                                                            return 'rgba(156, 39, 176, 0.1)'; // 专属紫色背景
                                                        }
                                                        return 'rgba(33, 150, 243, 0.1)'; // 淡蓝色背景
                                                    })(),
                                                    borderRadius: '8px',
                                                    padding: '8px 12px',
                                                    border: (() => {
                                                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                        const scStyle = getSCStyle(songDetails.remarks);

                                                        if (hasSC && scStyle) {
                                                            return `1px solid ${scStyle.color}30`; // SC主题色边框
                                                        } else if (hasExclusive) {
                                                            return '1px solid rgba(156, 39, 176, 0.3)';
                                                        }
                                                        return '1px solid rgba(33, 150, 243, 0.3)';
                                                    })()
                                                }}
                                            >
                                                <AlbumIcon sx={{
                                                    color: (() => {
                                                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                        const scStyle = getSCStyle(songDetails.remarks);

                                                        if (hasSC && scStyle) {
                                                            return scStyle.color;
                                                        } else if (hasExclusive) {
                                                            return '#9C27B0';
                                                        }
                                                        return '#2196F3';
                                                    })(),
                                                    fontSize: 16
                                                }} />
                                                <Box flex={1}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                                                        专辑
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem' }}>
                                                        {songDetails.album || '未知专辑'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* 时长信息 */}
                                            <Box 
                                                display="flex" 
                                                alignItems="center" 
                                                gap={1.5}
                                                sx={{
                                                    backgroundColor: (() => {
                                                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                        const scStyle = getSCStyle(songDetails.remarks);

                                                        if (hasSC && scStyle) {
                                                            return `${scStyle.bg}40`; // SC主题色背景，40%透明度
                                                        } else if (hasExclusive) {
                                                            return 'rgba(156, 39, 176, 0.1)'; // 专属紫色背景
                                                        }
                                                        return 'rgba(33, 150, 243, 0.1)'; // 淡蓝色背景
                                                    })(),
                                                    borderRadius: '8px',
                                                    padding: '8px 12px',
                                                    border: (() => {
                                                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                        const scStyle = getSCStyle(songDetails.remarks);

                                                        if (hasSC && scStyle) {
                                                            return `1px solid ${scStyle.color}30`; // SC主题色边框
                                                        } else if (hasExclusive) {
                                                            return '1px solid rgba(156, 39, 176, 0.3)';
                                                        }
                                                        return '1px solid rgba(33, 150, 243, 0.3)';
                                                    })()
                                                }}
                                            >
                                                <AccessTimeIcon sx={{
                                                    color: (() => {
                                                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                        const scStyle = getSCStyle(songDetails.remarks);

                                                        if (hasSC && scStyle) {
                                                            return scStyle.color;
                                                        } else if (hasExclusive) {
                                                            return '#9C27B0';
                                                        }
                                                        return '#2196F3';
                                                    })(),
                                                    fontSize: 16
                                                }} />
                                                <Box flex={1}>
                                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                                                        时长
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem' }}>
                                                        {songDetails.duration ? formatDuration(songDetails.duration) : '未知时长'}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* 备注信息 */}
                                            {songDetails.info && songDetails.info.trim() !== "" && !songDetails.info.toString().includes("专属") && (
                                                <Box display="flex" alignItems="flex-start" gap={1.5}>
                                                    <CategoryIcon sx={{
                                                        color: (() => {
                                                            const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                            const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                            const scStyle = getSCStyle(songDetails.remarks);

                                                            if (hasSC && scStyle) {
                                                                return scStyle.color;
                                                            } else if (hasExclusive) {
                                                                return '#9C27B0';
                                                            }
                                                            return '#2196F3';
                                                        })(),
                                                        fontSize: 16,
                                                        mt: 0.2
                                                    }} />
                                                    <Box flex={1}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
                                                            备注
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.875rem' }}>
                                                            {songDetails.info}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Stack>

                                        {/* 关联投稿区域 - 移动到详细信息下面 */}
                                        <Box sx={{ mt: 3 }}>
                                            <Typography variant="subtitle2" fontWeight={600} sx={{
                                                color: '#757575',
                                                mb: 1.5,
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5
                                            }}>
                                                <VideoLibraryIcon sx={{ fontSize: 16 }} />
                                                关联投稿
                                            </Typography>

                                            {(() => {
                                                // 解析关联B站视频数据
                                                let relatedVideos = [];
                                                if (songDetails.relatedBilibiliVideo) {
                                                    try {
                                                        relatedVideos = JSON.parse(songDetails.relatedBilibiliVideo);
                                                    } catch (e) {
                                                        console.error('解析关联视频数据失败:', e);
                                                    }
                                                }

                                                if (relatedVideos && relatedVideos.length > 0) {
                                                    return (
                                                        <Box sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 1
                                                        }}>
                                                            {relatedVideos.map((video, index) => (
                                                                <CompactBilibiliVideoCard
                                                                    key={video.bv || index}
                                                                    video={video}
                                                                    index={index}
                                                                />
                                                            ))}
                                                        </Box>
                                                    );
                                                } else {
                                                    return (
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 1.5,
                                                                p: 1.5,
                                                                borderRadius: '8px',
                                                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                                                color: 'text.secondary',
                                                                height: '48px'
                                                            }}
                                                        >
                                                            <VideoLibraryIcon sx={{
                                                                fontSize: 20,
                                                                color: 'text.secondary',
                                                                opacity: 0.6
                                                            }} />
                                                            <Typography variant="body2" sx={{
                                                                color: 'text.secondary',
                                                                fontSize: '0.875rem',
                                                                opacity: 0.8
                                                            }}>
                                                                此歌曲暂未关联投稿
                                                            </Typography>
                                                        </Box>
                                                    );
                                                }
                                            })()}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* 右侧：歌词区域 - 修复手机端布局 */}
                                <Box sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: { xs: 'visible', md: 'hidden' }, // 手机端不单独滚动
                                    minHeight: { xs: 'auto', md: 'auto' } // 手机端去除高度限制
                                }}>
                                    {/* 歌词标题 */}
                                    <Box sx={{
                                        p: 2.5,
                                        pb: 1.5,
                                        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
                                    }}>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <LyricsIcon sx={{
                                                    color: (() => {
                                                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                        const scStyle = getSCStyle(songDetails.remarks);

                                                        if (hasSC && scStyle) {
                                                            return "#1a1a1a";
                                                        } else if (hasExclusive) {
                                                            return '#9C27B0';
                                                        }
                                                        return '#2196F3';
                                                    })(),
                                                    fontSize: 20
                                                }} />
                                                <Typography variant="subtitle1" fontWeight={600} color="#1a1a1a" sx={{ fontSize: '1rem' }}>
                                                    歌词
                                                </Typography>
                                                {/* 时间显示 */}
                                                {isPlaying && (
                                                    <Typography variant="body2" sx={{
                                                        color: '#666',
                                                        fontSize: '0.75rem',
                                                        fontFamily: 'monospace',
                                                        ml: 1
                                                    }}>
                                                        {formatTime(currentTime)}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* 播放控制按钮 */}
                                            <Box ref={playbackControlsRef} display="flex" alignItems="center" gap={0.5}>
                                                <IconButton
                                                    onClick={handlePlayPause}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: (() => {
                                                            const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                            const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                            const scStyle = getSCStyle(songDetails.remarks);

                                                            if (hasSC && scStyle) {
                                                                return `${scStyle.color}15`;
                                                            } else if (hasExclusive) {
                                                                return 'rgba(156, 39, 176, 0.1)';
                                                            }
                                                            return 'rgba(33, 150, 243, 0.1)';
                                                        })(),
                                                        color: (() => {
                                                            const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                            const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                            const scStyle = getSCStyle(songDetails.remarks);

                                                            if (hasSC && scStyle) {
                                                                return scStyle.color;
                                                            } else if (hasExclusive) {
                                                                return '#9C27B0';
                                                            }
                                                            return '#2196F3';
                                                        })(),
                                                        width: 32,
                                                        height: 32,
                                                        '&:hover': {
                                                            backgroundColor: (() => {
                                                                const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                                                const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                                                const scStyle = getSCStyle(songDetails.remarks);

                                                                if (hasSC && scStyle) {
                                                                    return `${scStyle.color}25`;
                                                                } else if (hasExclusive) {
                                                                    return 'rgba(156, 39, 176, 0.15)';
                                                                }
                                                                return 'rgba(33, 150, 243, 0.15)';
                                                            })()
                                                        }
                                                    }}
                                                >
                                                    {isPlaying ? <PauseIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
                                                </IconButton>

                                                <IconButton
                                                    onClick={handleStop}
                                                    size="small"
                                                    disabled={!isPlaying && currentTime === 0}
                                                    sx={{
                                                        color: '#666',
                                                        width: 28,
                                                        height: 28,
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.05)'
                                                        },
                                                        '&:disabled': {
                                                            color: '#ccc'
                                                        }
                                                    }}
                                                >
                                                    <StopIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* 歌词内容 */}
                                    <Box sx={{
                                        flex: 1,
                                        p: 2.5,
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        {songDetails.lyrics ? (() => {
                                            const { metadata, lines } = parseLyrics(songDetails.lyrics);
                                            const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                            const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                            const scStyle = getSCStyle(songDetails.remarks);





                                            // 主题色配置
                                            const themeColor = (() => {
                                                if (hasSC && scStyle) {
                                                    return {
                                                        primary: scStyle.color,        // SC文字颜色（深色）
                                                        bg: scStyle.bg,               // SC背景颜色（淡色）
                                                        border: scStyle.border,       // SC边框颜色
                                                        light: scStyle.bg,            // 浅色背景
                                                        text: scStyle.color           // 确保文字颜色正确
                                                    };
                                                } else if (hasExclusive) {
                                                    return {
                                                        primary: '#9C27B0',           // 专属文字颜色（深紫色）
                                                        bg: 'rgba(156, 39, 176, 0.1)', // 专属背景颜色（淡紫色）
                                                        border: '#9C27B0',            // 专属边框颜色
                                                        light: 'rgba(156, 39, 176, 0.08)', // 浅色背景
                                                        text: '#9C27B0'               // 确保文字颜色正确
                                                    };
                                                }
                                                // 普通卡片
                                                return {
                                                    primary: '#1976D2',            // 普通文字颜色（深蓝色）
                                                    bg: 'rgba(33, 150, 243, 0.08)', // 普通背景颜色（淡蓝色）
                                                    border: '#2196F3',             // 普通边框颜色
                                                    light: 'rgba(33, 150, 243, 0.05)', // 浅色背景
                                                    text: '#1976D2'                // 确保文字颜色正确
                                                };
                                            })();

                                            return (
                                                <Box sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    {/* 歌词元数据显示 */}
                                                    {(metadata.ti || metadata.ar) && (
                                                        <Paper
                                                            elevation={0}
                                                            sx={{
                                                                p: 2,
                                                                mb: 2,
                                                                backgroundColor: themeColor.bg,
                                                                borderRadius: '12px',
                                                                border: `1px solid ${themeColor.border}20`
                                                            }}
                                                        >
                                                            {metadata.ti && (
                                                                <Typography variant="subtitle2" fontWeight={600} sx={{
                                                                    color: themeColor.primary,
                                                                    fontSize: '0.875rem',
                                                                    mb: 0.5
                                                                }}>
                                                                    {metadata.ti}
                                                                </Typography>
                                                            )}
                                                            {metadata.ar && (
                                                                <Typography variant="body2" sx={{
                                                                    color: (() => {
                                                                        if (hasSC && scStyle) {
                                                                            return scStyle.color;
                                                                        } else if (hasExclusive) {
                                                                            return '#9C27B0';
                                                                        }
                                                                        return '#2196F3';
                                                                    })(),
                                                                    fontSize: '0.75rem'
                                                                }}>
                                                                    演唱：{metadata.ar}
                                                                </Typography>
                                                            )}
                                                        </Paper>
                                                    )}

                                                    {/* 歌词列表 */}
                                                    <Box ref={lyricsContainerRef} sx={{
                                                        flex: 1,
                                                        overflow: 'auto',
                                                        pr: 1,
                                                        pl: 1,
                                                        py: 1,
                                                        '&::-webkit-scrollbar': {
                                                            width: '6px'
                                                        },
                                                        '&::-webkit-scrollbar-track': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                                            borderRadius: '3px'
                                                        },
                                                        '&::-webkit-scrollbar-thumb': {
                                                            backgroundColor: (() => {
                                                                if (hasSC && scStyle) {
                                                                    return scStyle.border + '80';
                                                                } else if (hasExclusive) {
                                                                    return '#9C27B080';
                                                                }
                                                                return '#2196F380';
                                                            })(),
                                                            borderRadius: '3px',
                                                            '&:hover': {
                                                                backgroundColor: (() => {
                                                                    if (hasSC && scStyle) {
                                                                        return scStyle.border + 'A0';
                                                                    } else if (hasExclusive) {
                                                                        return '#9C27B0A0';
                                                                    }
                                                                    return '#2196F3A0';
                                                                })()
                                                            }
                                                        }
                                                    }}>
                                                        <Stack spacing={0.8}>
                                                            {lines.map((line, index) => (
                                                                <motion.div
                                                                    key={index}
                                                                    initial={{ opacity: 0, x: -20 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                        delay: Math.min(index * 0.03, 0.8)
                                                                    }}
                                                                >
                                                                    <Paper
                                                                        elevation={0}
                                                                        data-lyric-index={index}
                                                                        sx={{
                                                                            p: 1.5,
                                                                            m: 0.5,
                                                                            backgroundColor: (() => {
                                                                                const isCurrentLine = currentLyricIndices.includes(index);

                                                                                if (isCurrentLine) {
                                                                                    // 当前播放行使用主题色背景
                                                                                    return themeColor.light;
                                                                                } else {
                                                                                    // 普通行使用白色背景
                                                                                    return 'rgba(255, 255, 255, 0.7)';
                                                                                }
                                                                            })(),
                                                                            borderRadius: '10px',
                                                                            border: (() => {
                                                                                const isCurrentLine = currentLyricIndices.includes(index);

                                                                                if (isCurrentLine) {
                                                                                    // 当前播放行使用主题色边框
                                                                                    return `2px solid ${themeColor.border}`;
                                                                                } else {
                                                                                    // 普通行使用淡边框
                                                                                    return '1px solid rgba(0, 0, 0, 0.06)';
                                                                                }
                                                                            })(),
                                                                            transition: 'all 0.3s ease',
                                                                            transform: (() => {
                                                                                const isCurrentLine = currentLyricIndices.includes(index);
                                                                                return isCurrentLine ? 'scale(1.02)' : 'scale(1)';
                                                                            })(),
                                                                            cursor: 'default',
                                                                            position: 'relative',
                                                                            overflow: 'hidden', // 改为hidden，防止色条溢出
                                                                            boxShadow: (() => {
                                                                                const isCurrentLine = currentLyricIndices.includes(index);

                                                                                if (isCurrentLine) {
                                                                                    // 当前播放行的强阴影
                                                                                    if (hasSC && scStyle) {
                                                                                        return `0 4px 16px ${scStyle.color}40, 0 0 0 2px ${scStyle.color}20`;
                                                                                    } else if (hasExclusive) {
                                                                                        return '0 4px 16px rgba(156, 39, 176, 0.3), 0 0 0 2px rgba(156, 39, 176, 0.2)';
                                                                                    }
                                                                                    return '0 4px 16px rgba(33, 150, 243, 0.3), 0 0 0 2px rgba(33, 150, 243, 0.2)';
                                                                                } else {
                                                                                    // 普通行的阴影
                                                                                    if (hasSC && scStyle) {
                                                                                        return `0 2px 8px ${scStyle.color}20`;
                                                                                    } else if (hasExclusive) {
                                                                                        return '0 2px 8px rgba(156, 39, 176, 0.15)';
                                                                                    }
                                                                                    return '0 1px 4px rgba(0, 0, 0, 0.08)';
                                                                                }
                                                                            })(),
                                                                            '&:hover': {
                                                                                backgroundColor: (() => {
                                                                                    if (hasSC && scStyle) {
                                                                                        return `linear-gradient(135deg, ${scStyle.bg}, ${scStyle.bg}EE)`;
                                                                                    } else if (hasExclusive) {
                                                                                        return 'linear-gradient(135deg, rgba(156, 39, 176, 0.18), rgba(156, 39, 176, 0.12))';
                                                                                    }
                                                                                    return themeColor.light;
                                                                                })(),
                                                                                borderColor: (() => {
                                                                                    if (hasSC && scStyle) {
                                                                                        return `${scStyle.border}B0`;
                                                                                    } else if (hasExclusive) {
                                                                                        return 'rgba(156, 39, 176, 0.6)';
                                                                                    }
                                                                                    return themeColor.border + '60';
                                                                                })(),
                                                                                transform: 'translateY(-1px)',
                                                                                boxShadow: (() => {
                                                                                    if (hasSC && scStyle) {
                                                                                        return `0 4px 16px ${scStyle.color}30`;
                                                                                    } else if (hasExclusive) {
                                                                                        return '0 4px 16px rgba(156, 39, 176, 0.25)';
                                                                                    }
                                                                                    return `0 4px 12px ${themeColor.primary}15`;
                                                                                })()
                                                                            }
                                                                        }}
                                                                    >
                                                                        {/* 时间标签 */}
                                                                        {line.timeText && (
                                                                            <Box
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    top: 8,
                                                                                    right: 8,
                                                                                    backgroundColor: (() => {
                                                                                        if (hasSC && scStyle) {
                                                                                            return `${scStyle.border}20`; // 使用边框颜色作为背景
                                                                                        } else if (hasExclusive) {
                                                                                            return 'rgba(156, 39, 176, 0.15)';
                                                                                        }
                                                                                        return 'rgba(33, 150, 243, 0.15)'; // 固定淡蓝色背景
                                                                                    })(),
                                                                                    color: (() => {
                                                                                        if (hasSC && scStyle) {
                                                                                            return scStyle.color; // SC深色文字
                                                                                        } else if (hasExclusive) {
                                                                                            return '#9C27B0'; // 专属深紫色文字
                                                                                        }
                                                                                        return '#1976D2'; // 普通深蓝色文字
                                                                                    })(),
                                                                                    px: 1,
                                                                                    py: 0.5,
                                                                                    borderRadius: '6px',
                                                                                    fontSize: '0.7rem',
                                                                                    fontWeight: 600,
                                                                                    fontFamily: 'monospace'
                                                                                }}
                                                                            >
                                                                                {line.timeText}
                                                                            </Box>
                                                                        )}

                                                                        {/* 歌词文本 */}
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                color: (() => {
                                                                                    if (hasSC && scStyle) {
                                                                                        return scStyle.color;
                                                                                    } else if (hasExclusive) {
                                                                                        return '#7B1FA2';
                                                                                    }
                                                                                    return '#2c3e50';
                                                                                })(),
                                                                                fontSize: (() => {
                                                                                    const isCurrentLine = currentLyricIndices.includes(index);
                                                                                    return isCurrentLine ? '0.95rem' : '0.875rem';
                                                                                })(),
                                                                                lineHeight: 1.5,
                                                                                fontWeight: (() => {
                                                                                    const isCurrentLine = currentLyricIndices.includes(index);

                                                                                    if (isCurrentLine) {
                                                                                        return 700; // 当前播放行字体更粗
                                                                                    } else if (hasSC && scStyle) {
                                                                                        return 600; // SC卡片字体更粗
                                                                                    } else if (hasExclusive) {
                                                                                        return 600;
                                                                                    }
                                                                                    return 500;
                                                                                })(),
                                                                                textShadow: (() => {
                                                                                    const isCurrentLine = currentLyricIndices.includes(index);
                                                                                    if (isCurrentLine) {
                                                                                        if (hasSC && scStyle) {
                                                                                            return `0 1px 2px ${scStyle.color}30`;
                                                                                        } else if (hasExclusive) {
                                                                                            return '0 1px 2px rgba(156, 39, 176, 0.3)';
                                                                                        }
                                                                                        return '0 1px 2px rgba(33, 150, 243, 0.3)';
                                                                                    }
                                                                                    return 'none';
                                                                                })(),
                                                                                pr: line.timeText ? 5 : 0,
                                                                                wordBreak: 'break-word'
                                                                            }}
                                                                        >
                                                                            {line.text}
                                                                        </Typography>

                                                                        {/* 左侧装饰色条 - 修复位置和显示问题 */}
                                                                        <Box
                                                                            sx={{
                                                                                position: 'absolute',
                                                                                left: '-1px', // 向左偏移1px，完全贴合边框
                                                                                top: '-1px', // 向上偏移1px，完全贴合边框
                                                                                bottom: '-1px', // 向下偏移1px，完全贴合边框
                                                                                width: (() => {
                                                                                    const isCurrentLine = currentLyricIndices.includes(index);
                                                                                    if (isCurrentLine) {
                                                                                        return '6px'; // 高亮时适中宽度
                                                                                    } else if (hasSC && scStyle) {
                                                                                        return '5px'; // SC卡片装饰条
                                                                                    } else if (hasExclusive) {
                                                                                        return '5px';
                                                                                    }
                                                                                    return '4px';
                                                                                })(),
                                                                                background: (() => {
                                                                                    const isCurrentLine = currentLyricIndices.includes(index);
                                                                                    if (hasSC && scStyle) {
                                                                                        return isCurrentLine
                                                                                            ? scStyle.color // 高亮时使用纯色
                                                                                            : `linear-gradient(to bottom, ${scStyle.color}C0, ${scStyle.color}60)`;
                                                                                    } else if (hasExclusive) {
                                                                                        return isCurrentLine
                                                                                            ? '#9C27B0'
                                                                                            : 'linear-gradient(to bottom, #9C27B0C0, #9C27B060)';
                                                                                    }
                                                                                    return isCurrentLine
                                                                                        ? themeColor.primary
                                                                                        : `linear-gradient(to bottom, ${themeColor.primary}A0, ${themeColor.primary}40)`;
                                                                                })(),
                                                                                borderRadius: '10px 0 0 10px', // 与主容器圆角匹配
                                                                                opacity: (() => {
                                                                                    const isCurrentLine = currentLyricIndices.includes(index);
                                                                                    if (isCurrentLine) {
                                                                                        return 1; // 高亮行完全显示
                                                                                    } else if (hasSC && scStyle) {
                                                                                        return 0.7; // SC卡片默认显示
                                                                                    } else if (hasExclusive) {
                                                                                        return 0.6;
                                                                                    }
                                                                                    return 0.3; // 普通行淡显示
                                                                                })(),
                                                                                transition: 'all 0.3s ease',
                                                                                zIndex: 1 // 确保在正确的层级
                                                                            }}
                                                                        />

                                                                        {/* SC卡片特殊光泽效果 - 修复图层问题 */}
                                                                        {(hasSC && scStyle) && (
                                                                            <Box
                                                                                sx={{
                                                                                    position: 'absolute',
                                                                                    top: 0,
                                                                                    left: 0,
                                                                                    right: 0,
                                                                                    height: '50%',
                                                                                    background: `linear-gradient(135deg, ${scStyle.bg}30 0%, transparent 60%)`,
                                                                                    borderRadius: '10px 10px 0 0',
                                                                                    opacity: (() => {
                                                                                        const isCurrentLine = currentLyricIndices.includes(index);
                                                                                        return isCurrentLine ? 0.4 : 0.2; // 高亮时稍微增强
                                                                                    })(),
                                                                                    pointerEvents: 'none',
                                                                                    zIndex: 0 // 确保在背景层
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Paper>
                                                                </motion.div>
                                                            ))}
                                                        </Stack>
                                                    </Box>
                                                </Box>
                                            );
                                        })() : (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    height: '100%',
                                                    color: 'text.secondary'
                                                }}
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Box
                                                        sx={{
                                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                            borderRadius: '50%',
                                                            p: 3,
                                                            mb: 2
                                                        }}
                                                    >
                                                        <LyricsIcon sx={{ fontSize: 48, opacity: 0.4 }} />
                                                    </Box>
                                                    <Typography variant="body1" fontWeight={400} sx={{
                                                        fontSize: '0.875rem',
                                                        textAlign: 'center'
                                                    }}>
                                                        暂无歌词
                                                    </Typography>
                                                </motion.div>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </DialogContent>

            {/* 浮动播放控制栏 - 在modal内部显示 */}
            {showFloatingControls && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 60,
                        left: 16,
                        right: 16,
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(15px)',
                        borderRadius: 2,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 1000,
                        animation: 'fadeInUp 0.3s ease-out',
                        '@keyframes fadeInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(20px)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}
                >
                    {/* 歌曲信息 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flex: 1 }}>
                        {/* 歌词播放标题 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LyricsIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: 'text.primary'
                                }}
                            >
                                歌词播放中
                            </Typography>
                        </Box>

                        {/* 歌曲信息 */}
                        {songDetails.cover && (
                            <Box
                                component="img"
                                src={songDetails.cover}
                                alt="Cover"
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 1,
                                    objectFit: 'cover',
                                    flexShrink: 0
                                }}
                            />
                        )}
                        <Box sx={{ minWidth: 0, maxWidth: 140 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {songDetails.title}
                            </Typography>
                            {songDetails.artist && (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.65rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {songDetails.artist}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* 播放控制按钮 */}
                    <Box display="flex" alignItems="center" gap={0.5} sx={{ flexShrink: 0 }}>
                        <IconButton
                            onClick={handlePlayPause}
                            size="small"
                            sx={{
                                backgroundColor: (() => {
                                    const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                    const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                    const scStyle = getSCStyle(songDetails.remarks);

                                    if (hasSC && scStyle) {
                                        return `${scStyle.color}15`;
                                    } else if (hasExclusive) {
                                        return 'rgba(156, 39, 176, 0.1)';
                                    }
                                    return 'rgba(33, 150, 243, 0.1)';
                                })(),
                                color: (() => {
                                    const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                    const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                    const scStyle = getSCStyle(songDetails.remarks);

                                    if (hasSC && scStyle) {
                                        return scStyle.color;
                                    } else if (hasExclusive) {
                                        return '#9C27B0';
                                    }
                                    return '#2196F3';
                                })(),
                                width: 32,
                                height: 32,
                                '&:hover': {
                                    backgroundColor: (() => {
                                        const hasSC = songDetails.remarks && songDetails.remarks.trim() !== "";
                                        const hasExclusive = songDetails.info && songDetails.info.toString().includes("专属");
                                        const scStyle = getSCStyle(songDetails.remarks);

                                        if (hasSC && scStyle) {
                                            return `${scStyle.color}25`;
                                        } else if (hasExclusive) {
                                            return 'rgba(156, 39, 176, 0.15)';
                                        }
                                        return 'rgba(33, 150, 243, 0.15)';
                                    })()
                                }
                            }}
                        >
                            {isPlaying ? <PauseIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
                        </IconButton>

                        <IconButton
                            onClick={handleStop}
                            size="small"
                            disabled={!isPlaying && currentTime === 0}
                            sx={{
                                color: '#666',
                                width: 28,
                                height: 28,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)'
                                },
                                '&:disabled': {
                                    color: '#ccc'
                                }
                            }}
                        >
                            <StopIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                    </Box>

                    {/* 时间显示 */}
                    {songDetails.duration && (
                        <Typography variant="caption" sx={{
                            color: 'text.secondary',
                            fontFamily: 'monospace',
                            fontSize: '0.65rem',
                            minWidth: 'fit-content'
                        }}>
                            {formatTime(currentTime)} / {formatTime(songDetails.duration)}
                        </Typography>
                    )}
                </Box>
            )}
        </Dialog>
    );
};

export default MusicDetailsModal;
