import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';

// 模拟不同类型的歌曲数据
const mockSongs = [
    {
        type: 'normal',
        name: '普通歌曲',
        remarks: '',
        info: '',
        lyrics: `[ti:测试歌曲]
[ar:测试歌手]
[00:15.30]这是一首普通歌曲的歌词
[00:20.45]展示基础的歌词显示效果
[00:25.60]每一行都有时间戳`
    },
    {
        type: '30sc',
        name: '30SC歌曲',
        remarks: '30',
        info: '',
        lyrics: `[ti:30SC歌曲]
[ar:尊贵歌手]
[00:15.30]这是30SC歌曲的歌词
[00:20.45]应该显示蓝色主题
[00:25.60]更加精致的视觉效果`
    },
    {
        type: '50sc',
        name: '50SC歌曲',
        remarks: '50',
        info: '',
        lyrics: `[ti:50SC歌曲]
[ar:黄金歌手]
[00:15.30]这是50SC歌曲的歌词
[00:20.45]应该显示金色主题
[00:25.60]尊贵的金色光泽`
    },
    {
        type: '100sc',
        name: '100SC歌曲',
        remarks: '100',
        info: '',
        lyrics: `[ti:100SC歌曲]
[ar:传奇歌手]
[00:15.30]这是100SC歌曲的歌词
[00:20.45]应该显示红色主题
[00:25.60]最高级的视觉效果`
    },
    {
        type: 'exclusive',
        name: '专属歌曲',
        remarks: '',
        info: '专属内容',
        lyrics: `[ti:专属歌曲]
[ar:专属歌手]
[00:15.30]这是专属歌曲的歌词
[00:20.45]应该显示紫色主题
[00:25.60]专属的尊贵感`
    }
];

// SC价值映射
const scColorMapping = {
    low: { bg: '#BBDEFB', color: '#0D47A1', border: '#2196F3' },
    medium: { bg: '#FFF8E1', color: '#E65100', border: '#FFC107' },
    high: { bg: '#FFCDD2', color: '#B71C1C', border: '#F44336' },
};

const getSCStyle = (scValue) => {
    if (!scValue) return null;
    const scNumber = parseInt(scValue);
    if (isNaN(scNumber)) {
        return scColorMapping.low;
    } else if (scNumber < 50) {
        return scColorMapping.low;
    } else if (scNumber >= 50 && scNumber < 100) {
        return scColorMapping.medium;
    } else {
        return scColorMapping.high;
    }
};

// 解析歌词
const parseLyrics = (lyrics) => {
    if (!lyrics) return { metadata: {}, lines: [] };
    
    const metadata = {};
    const lines = [];
    
    const lrcLines = lyrics.split('\n');
    
    lrcLines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        const metaMatch = line.match(/^\[(\w+):(.+)\]$/);
        if (metaMatch) {
            const [, key, value] = metaMatch;
            metadata[key] = value.trim();
            return;
        }
        
        const timeMatch = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)$/);
        if (timeMatch) {
            const [, minutes, seconds, centiseconds, text] = timeMatch;
            
            if (text.trim()) {
                lines.push({
                    time: parseInt(minutes) * 60 + parseInt(seconds) + parseInt(centiseconds) / 100,
                    timeText: `${minutes}:${seconds}`,
                    text: text.trim()
                });
            }
        }
    });
    
    return { metadata, lines };
};

const LyricsPreview = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                歌词卡片设计预览
            </Typography>
            
            {mockSongs.map((song, songIndex) => {
                const { metadata, lines } = parseLyrics(song.lyrics);
                const hasSC = song.remarks && song.remarks.trim() !== "";
                const hasExclusive = song.info && song.info.toString().includes("专属");
                const scStyle = getSCStyle(song.remarks);
                
                // 主题色配置
                const themeColor = (() => {
                    if (hasSC && scStyle) {
                        return {
                            primary: scStyle.color,
                            bg: scStyle.bg,
                            border: scStyle.border,
                            light: `${scStyle.bg}20`
                        };
                    } else if (hasExclusive) {
                        return {
                            primary: '#9C27B0',
                            bg: '#E1BEE7',
                            border: '#9C27B0',
                            light: 'rgba(156, 39, 176, 0.08)'
                        };
                    }
                    return {
                        primary: '#2196F3',
                        bg: '#E3F2FD',
                        border: '#2196F3',
                        light: 'rgba(33, 150, 243, 0.08)'
                    };
                })();
                
                return (
                    <Box key={songIndex} sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: themeColor.primary }}>
                            {song.name}
                        </Typography>
                        
                        <Box sx={{ 
                            maxHeight: '300px',
                            overflow: 'auto',
                            pr: 1
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
                                            sx={{
                                                p: 1.5,
                                                backgroundColor: (() => {
                                                    if (hasSC && scStyle) {
                                                        return `linear-gradient(135deg, ${scStyle.bg}F0, ${scStyle.bg}E0)`;
                                                    } else if (hasExclusive) {
                                                        return 'linear-gradient(135deg, rgba(156, 39, 176, 0.12), rgba(156, 39, 176, 0.08))';
                                                    }
                                                    return 'rgba(255, 255, 255, 0.8)';
                                                })(),
                                                borderRadius: '10px',
                                                border: (() => {
                                                    if (hasSC && scStyle) {
                                                        return `1.5px solid ${scStyle.border}80`;
                                                    } else if (hasExclusive) {
                                                        return '1.5px solid rgba(156, 39, 176, 0.4)';
                                                    }
                                                    return '1px solid rgba(0, 0, 0, 0.08)';
                                                })(),
                                                position: 'relative',
                                                overflow: 'hidden',
                                                boxShadow: (() => {
                                                    if (hasSC && scStyle) {
                                                        return `0 2px 8px ${scStyle.color}20`;
                                                    } else if (hasExclusive) {
                                                        return '0 2px 8px rgba(156, 39, 176, 0.15)';
                                                    }
                                                    return '0 1px 4px rgba(0, 0, 0, 0.08)';
                                                })(),
                                                '&:hover': {
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
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    backgroundColor: (() => {
                                                        if (hasSC && scStyle) {
                                                            return `${scStyle.color}20`;
                                                        } else if (hasExclusive) {
                                                            return 'rgba(156, 39, 176, 0.15)';
                                                        }
                                                        return themeColor.primary + '15';
                                                    })(),
                                                    color: (() => {
                                                        if (hasSC && scStyle) {
                                                            return scStyle.color;
                                                        } else if (hasExclusive) {
                                                            return '#9C27B0';
                                                        }
                                                        return themeColor.primary;
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
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.5,
                                                    fontWeight: (() => {
                                                        if (hasSC && scStyle) {
                                                            return 600;
                                                        } else if (hasExclusive) {
                                                            return 600;
                                                        }
                                                        return 500;
                                                    })(),
                                                    pr: 5,
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {line.text}
                                            </Typography>
                                            
                                            {/* 装饰性渐变条 */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    left: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    width: (() => {
                                                        if (hasSC && scStyle) {
                                                            return '4px';
                                                        } else if (hasExclusive) {
                                                            return '4px';
                                                        }
                                                        return '3px';
                                                    })(),
                                                    background: (() => {
                                                        if (hasSC && scStyle) {
                                                            return `linear-gradient(to bottom, ${scStyle.color}A0, ${scStyle.color}40)`;
                                                        } else if (hasExclusive) {
                                                            return 'linear-gradient(to bottom, #9C27B0A0, #9C27B040)';
                                                        }
                                                        return `linear-gradient(to bottom, ${themeColor.primary}80, ${themeColor.primary}20)`;
                                                    })(),
                                                    borderRadius: '0 3px 3px 0',
                                                    opacity: (() => {
                                                        if (hasSC && scStyle) {
                                                            return 0.6;
                                                        } else if (hasExclusive) {
                                                            return 0.5;
                                                        }
                                                        return 0;
                                                    })()
                                                }}
                                            />
                                            
                                            {/* SC卡片特殊光泽效果 */}
                                            {(hasSC && scStyle) && (
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: '50%',
                                                        background: `linear-gradient(135deg, ${scStyle.bg}40 0%, transparent 50%)`,
                                                        borderRadius: '10px 10px 0 0',
                                                        opacity: 0.3,
                                                        pointerEvents: 'none'
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
            })}
        </Box>
    );
};

export default LyricsPreview;