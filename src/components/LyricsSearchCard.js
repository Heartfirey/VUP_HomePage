import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    ContentCopy as ContentCopyIcon,
    Lyrics as LyricsIcon
} from '@mui/icons-material';
import { getSCStyle } from '../utils/scUtils';

// Badge icons
import TranslateIcon from '@mui/icons-material/Translate';
import PaletteIcon from '@mui/icons-material/Palette';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NatureIcon from '@mui/icons-material/Nature';
import CreateIcon from '@mui/icons-material/Create';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import InfoIcon from '@mui/icons-material/Info';

const getCategoryIcon = (category) => {
    const categoryMap = {
        '古风': PaletteIcon,
        '流行': TrendingUpIcon,
        '民谣': NatureIcon,
        '原创': CreateIcon,
        '儿歌': ChildCareIcon,
    };
    return categoryMap[category] || InfoIcon;
};

const getLanguageIcon = (language) => {
    return TranslateIcon;
};

const highlightText = (text, searchKeyword) => {
    if (!searchKeyword || !text) return text;
    
    const regex = new RegExp(`(${searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
        regex.test(part) ? (
            <span key={index} style={{ 
                backgroundColor: '#FFE082', 
                color: '#E65100',
                fontWeight: 'bold',
                padding: '2px 4px',
                borderRadius: '4px'
            }}>
                {part}
            </span>
        ) : part
    );
};

const extractLyricsSnippet = (lyrics, searchKeyword, maxLines = 2) => {
    if (!lyrics || !searchKeyword) return null;
    
    const lines = lyrics.split('\n').filter(line => line.trim() !== '');
    const matchingLines = [];
    const processedIndices = new Set(); // 避免重复处理相邻行
    
    for (let i = 0; i < lines.length && matchingLines.length < maxLines; i++) {
        const line = lines[i];
        // 移除时间戳标记后进行匹配
        const cleanLine = line.replace(/^\[\d{1,2}:\d{2}(?:\.\d{2,3})?\]/, '').trim();
        
        if (cleanLine && cleanLine.toLowerCase().includes(searchKeyword.toLowerCase()) && !processedIndices.has(i)) {
            // 标记当前行和相邻行为已处理，避免重复
            for (let j = Math.max(0, i - 1); j <= Math.min(lines.length - 1, i + 1); j++) {
                processedIndices.add(j);
            }
            
            // 只获取匹配行和下一行作为上下文
            const contextLines = [];
            const matchIndex = 0;
            
            // 添加匹配行
            contextLines.push(line);
            
            // 如果有下一行，添加作为上下文
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                const nextCleanLine = nextLine.replace(/^\[\d{1,2}:\d{2}(?:\.\d{2,3})?\]/, '').trim();
                if (nextCleanLine) {
                    contextLines.push(nextLine);
                }
            }
            
            matchingLines.push({
                lines: contextLines,
                matchIndex: matchIndex,
                originalIndex: i,
                matchedText: cleanLine
            });
        }
    }
    
    return matchingLines.length > 0 ? matchingLines : null;
};

const LyricsSearchCard = ({ 
    song, 
    searchKeyword, 
    onCopy, 
    onDoubleClick,
    style = {} 
}) => {
    const scStyle = getSCStyle(song.songNum);
    const lyricsSnippets = extractLyricsSnippet(song.lyrics, searchKeyword);
    
    const handleCopy = (e) => {
        e.stopPropagation();
        if (onCopy) {
            onCopy(song.songName);
        }
    };

    const handleDoubleClick = () => {
        if (onDoubleClick) {
            onDoubleClick(song);
        }
    };

    return (
        <Card
            onDoubleClick={handleDoubleClick}
            sx={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: scStyle?.bg || 'rgba(255, 255, 255, 0.95)',
                border: `1px solid ${scStyle?.border || 'rgba(255, 255, 255, 0.3)'}`,
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 16px 48px ${scStyle?.color || '#2196F3'}20`,
                    backgroundColor: scStyle?.bg || 'rgba(255, 255, 255, 1)',
                },
                ...style
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header with song info and actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: scStyle?.color || '#1a1a1a',
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {highlightText(song.songName, searchKeyword)}
                        </Typography>
                        
                        {song.artist && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: scStyle?.color ? `${scStyle.color}CC` : '#666',
                                    mb: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {highlightText(song.artist, searchKeyword)}
                            </Typography>
                        )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                        <Tooltip title="复制歌名">
                            <IconButton
                                size="small"
                                onClick={handleCopy}
                                sx={{
                                    color: scStyle?.color || '#666',
                                    '&:hover': {
                                        backgroundColor: `${scStyle?.color || '#2196F3'}15`
                                    }
                                }}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Lyrics snippets */}
                {lyricsSnippets && lyricsSnippets.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                            <LyricsIcon sx={{ fontSize: 16, color: '#FF9800', mr: 0.5 }} />
                            <Typography variant="caption" sx={{ color: '#FF9800', fontWeight: 600, fontSize: '0.8rem' }}>
                                匹配歌词 ({lyricsSnippets.length}处)
                            </Typography>
                        </Box>
                        
                        {lyricsSnippets.map((snippet, index) => (
                            <Box
                                key={index}
                                sx={{
                                    backgroundColor: '#FFF8E1',
                                    border: '2px solid #FFE082',
                                    borderRadius: '12px',
                                    p: 2,
                                    mb: index < lyricsSnippets.length - 1 ? 1.5 : 0,
                                    position: 'relative',
                                    '&::before': {
                                        content: '"♪"',
                                        position: 'absolute',
                                        top: 8,
                                        right: 12,
                                        color: '#FF9800',
                                        fontSize: '1.2rem',
                                        opacity: 0.6
                                    }
                                }}
                            >
                                {snippet.lines.map((line, lineIndex) => {
                                    // Remove timestamp markers from lyrics
                                    const cleanLine = line.replace(/^\[\d{1,2}:\d{2}(?:\.\d{2,3})?\]/, '').trim();
                                    if (!cleanLine) return null;
                                    
                                    const isMatchingLine = lineIndex === snippet.matchIndex;
                                    
                                    return (
                                        <Box key={lineIndex} sx={{ mb: lineIndex < snippet.lines.length - 1 ? 1 : 0 }}>
                                            {isMatchingLine && (
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    mb: 0.5,
                                                    opacity: 0.7
                                                }}>
                                                    <Box sx={{
                                                        width: 4,
                                                        height: 4,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#FF9800',
                                                        mr: 0.5
                                                    }} />
                                                    <Typography variant="caption" sx={{ 
                                                        color: '#E65100', 
                                                        fontWeight: 500,
                                                        fontSize: '0.7rem'
                                                    }}>
                                                        匹配行
                                                    </Typography>
                                                </Box>
                                            )}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: isMatchingLine ? '#E65100' : '#666',
                                                    lineHeight: 1.8,
                                                    fontWeight: isMatchingLine ? 700 : 400,
                                                    fontSize: isMatchingLine ? '0.95rem' : '0.85rem',
                                                    backgroundColor: isMatchingLine ? '#FFECB3' : 'transparent',
                                                    padding: isMatchingLine ? '6px 10px' : '2px 0',
                                                    borderRadius: isMatchingLine ? '6px' : '0',
                                                    border: isMatchingLine ? '1px solid #FFD54F' : 'none'
                                                }}
                                            >
                                                {isMatchingLine ? highlightText(cleanLine, searchKeyword) : cleanLine}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Song metadata chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {/* SC Badge */}
                    {song.songNum && (
                        <Chip
                            label={`${song.songNum}SC`}
                            size="small"
                            sx={{
                                backgroundColor: scStyle?.bg || '#E3F2FD',
                                color: scStyle?.color || '#1976D2',
                                border: `1px solid ${scStyle?.border || '#BBDEFB'}`,
                                fontWeight: 600,
                                fontSize: '0.75rem'
                            }}
                        />
                    )}
                    
                    {/* Language */}
                    {song.language && (
                        <Chip
                            icon={React.createElement(getLanguageIcon(song.language), { 
                                style: { fontSize: 12, color: scStyle?.color || '#666' } 
                            })}
                            label={song.language}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: `${scStyle?.color || '#666'}40`,
                                color: scStyle?.color || '#666',
                                fontSize: '0.75rem'
                            }}
                        />
                    )}
                    
                    {/* Song Type */}
                    {song.songType && song.songType !== song.language && (
                        <Chip
                            icon={React.createElement(getCategoryIcon(song.songType), { 
                                style: { fontSize: 12, color: scStyle?.color || '#666' } 
                            })}
                            label={song.songType}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: `${scStyle?.color || '#666'}40`,
                                color: scStyle?.color || '#666',
                                fontSize: '0.75rem'
                            }}
                        />
                    )}
                    
                    {/* Remarks */}
                    {song.remarks && song.remarks !== '专属' && (
                        <Chip
                            icon={<InfoIcon style={{ fontSize: 12, color: scStyle?.color || '#666' }} />}
                            label={song.remarks}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: `${scStyle?.color || '#666'}40`,
                                color: scStyle?.color || '#666',
                                fontSize: '0.75rem'
                            }}
                        />
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default LyricsSearchCard;
