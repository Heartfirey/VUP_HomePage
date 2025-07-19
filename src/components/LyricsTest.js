import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

// 测试歌词解析功能
const testLyrics = `[ti:雪姬]
[ar:黄诗扶]
[al:]
[by:]
[offset:0]
[00:00.00]雪姬 - 黄诗扶
[00:26.15]落日 诵笛 白雪 古琴
[00:32.10]雨落 蓑衣 清风 竹林
[00:38.01]静坐 抚琴 移步 更衣
[00:43.89]曲起 舞步轻灵
[00:48.91]
[00:49.79]赤雨 急信 漠北 新兵
[00:55.67]金鸣 司命 止舞 封琴
[01:01.59]独坐 孤吟 雪落 无垠
[01:07.44]起舞 独舞空灵
[01:12.61]
[01:13.30]你是否还能记起 寒夜孤灯里
[01:19.71]伴着白雪的舞姬
[01:24.34]
[01:25.09]看水袖随风起 舞步辗转急
[01:31.57]还盼你荣归故里
[01:37.15]`;

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
        
        // 解析时间戳歌词 [mm:ss.xx]歌词内容
        const timeMatch = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)$/);
        if (timeMatch) {
            const [, minutes, seconds, centiseconds, text] = timeMatch;
            const timeInSeconds = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(centiseconds) / 100;
            
            if (text.trim()) {
                lines.push({
                    time: timeInSeconds,
                    timeText: `${minutes}:${seconds}`,
                    text: text.trim()
                });
            }
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
    
    // 按时间排序
    lines.sort((a, b) => {
        if (a.time === null) return 1;
        if (b.time === null) return -1;
        return a.time - b.time;
    });
    
    return { metadata, lines };
};

const LyricsTest = () => {
    const { metadata, lines } = parseLyrics(testLyrics);
    
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                歌词解析测试
            </Typography>
            
            {/* 元数据显示 */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>元数据:</Typography>
                <pre>{JSON.stringify(metadata, null, 2)}</pre>
            </Paper>
            
            {/* 解析后的歌词行 */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>解析后的歌词行 ({lines.length} 行):</Typography>
                {lines.map((line, index) => (
                    <Box key={index} sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        py: 0.5,
                        borderBottom: '1px solid #eee'
                    }}>
                        <Typography variant="body2" sx={{ 
                            minWidth: '60px', 
                            fontFamily: 'monospace',
                            color: '#666'
                        }}>
                            {line.timeText || 'N/A'}
                        </Typography>
                        <Typography variant="body1">
                            {line.text}
                        </Typography>
                    </Box>
                ))}
            </Paper>
        </Box>
    );
};

export default LyricsTest;