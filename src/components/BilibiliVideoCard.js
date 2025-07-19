import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Visibility as ViewIcon,
    ChatBubbleOutline as DanmakuIcon,
    AccessTime as TimeIcon,
    OpenInNew as OpenIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const BilibiliVideoCard = ({ video, index = 0 }) => {
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card
                sx={{
                    maxWidth: 320,
                    minWidth: 280,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        '& .play-overlay': {
                            opacity: 1
                        }
                    }
                }}
                onClick={openVideo}
            >
                {/* 视频封面 */}
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={video.cover || '/default-video-cover.jpg'}
                        alt={video.title}
                        sx={{
                            objectFit: 'cover',
                            backgroundColor: '#f5f5f5'
                        }}
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                    />
                    
                    {/* 播放按钮覆盖层 */}
                    <Box
                        className="play-overlay"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    >
                        <IconButton
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                color: '#00a1d6',
                                '&:hover': {
                                    backgroundColor: 'white'
                                }
                            }}
                        >
                            <PlayIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                    </Box>

                    {/* 时长标签 */}
                    {video.duration && (
                        <Chip
                            icon={<TimeIcon sx={{ fontSize: 14 }} />}
                            label={video.duration}
                            size="small"
                            sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                fontSize: '0.7rem',
                                height: '24px'
                            }}
                        />
                    )}

                    {/* B站标识 */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: '#00a1d6',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 600
                        }}
                    >
                        bilibili
                    </Box>
                </Box>

                {/* 视频信息 */}
                <CardContent sx={{ p: 2 }}>
                    {/* 标题 */}
                    <Tooltip title={video.title} placement="top">
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.3,
                                minHeight: '2.6em'
                            }}
                        >
                            {video.title}
                        </Typography>
                    </Tooltip>

                    {/* UP主 */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            fontSize: '0.8rem'
                        }}
                    >
                        {video.author}
                    </Typography>

                    {/* 统计信息 */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ViewIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {formatView(video.view)}
                                </Typography>
                            </Box>
                            
                            {video.danmaku > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <DanmakuIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatView(video.danmaku)}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <IconButton
                            size="small"
                            sx={{
                                color: '#00a1d6',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,161,214,0.1)'
                                }
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                openVideo();
                            }}
                        >
                            <OpenIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Box>

                    {/* 发布时间 */}
                    {video.pubDate && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: 'block',
                                mt: 1,
                                fontSize: '0.7rem'
                            }}
                        >
                            {video.pubDate}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default BilibiliVideoCard;