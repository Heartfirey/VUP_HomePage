// src/components/LiveRecord/TimelineTable.js
import React, { useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import config from '../../config';

// 导入MUI图标
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FlagIcon from '@mui/icons-material/Flag';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import StarIcon from '@mui/icons-material/Star';
import LaunchIcon from '@mui/icons-material/Launch';

const iconMap = {
    song: MusicNoteIcon,
    milestone: EmojiEventsIcon,
    chat: ChatBubbleIcon,
    flag: FlagIcon,
    start: PlayArrowIcon,
    end: StopIcon,
    break: PauseIcon,
    highlight: StarIcon
};

const TimelineTable = ({ points = [], streamStartTime, isExpanded = false, onToggle }) => {
    if (!points || points.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                暂无时间点数据
            </div>
        );
    }
    
    // 格式化相对时间
    const formatRelativeTime = (timestamp) => {
        const time = dayjs.unix(timestamp);
        const streamStart = dayjs(streamStartTime);
        const diff = time.diff(streamStart, 'minute');
        
        if (diff < 60) {
            return `${diff}分钟`;
        } else {
            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
        }
    };
    
    // 格式化绝对时间
    const formatAbsoluteTime = (timestamp) => {
        return dayjs.unix(timestamp).format('HH:mm:ss');
    };
    
    // 获取类型名称
    const getTypeName = (type) => {
        return config.recordStyle.timelineTypeNameMap[type] || type;
    };
    
    return (
        <div className="bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
            {/* 表格头部 - 可折叠 */}
            <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={onToggle}
            >
                <h3 className="text-white font-medium">时间点详情 ({points.length}个)</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">
                        {isExpanded ? '收起' : '展开'}
                    </span>
                    {isExpanded ? (
                        <ExpandLessIcon sx={{ color: 'rgb(156, 163, 175)', fontSize: 20 }} />
                    ) : (
                        <ExpandMoreIcon sx={{ color: 'rgb(156, 163, 175)', fontSize: 20 }} />
                    )}
                </div>
            </div>
            
            {/* 表格内容 */}
            {isExpanded && (
                <div className="border-t border-white/10">
                    {/* 桌面端表格 */}
                    <div className="hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left p-3 text-gray-300 text-sm font-medium">类型</th>
                                        <th className="text-left p-3 text-gray-300 text-sm font-medium">名称</th>
                                        <th className="text-left p-3 text-gray-300 text-sm font-medium">相对时间</th>
                                        <th className="text-left p-3 text-gray-300 text-sm font-medium">绝对时间</th>
                                        <th className="text-left p-3 text-gray-300 text-sm font-medium">备注</th>
                                        <th className="text-left p-3 text-gray-300 text-sm font-medium">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {points.map((point, index) => {
                                        const IconComponent = iconMap[point.type] || StarIcon;
                                        return (
                                            <tr 
                                                key={point.id}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                            >
                                                <td className="p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <div
                                                            className="w-6 h-6 rounded-full flex items-center justify-center border"
                                                            style={{
                                                                backgroundColor: point.backgroundColor || 'rgba(255,255,255,0.1)',
                                                                borderColor: point.foregroundColor || '#666'
                                                            }}
                                                        >
                                                            <IconComponent 
                                                                sx={{ 
                                                                    fontSize: 12, 
                                                                    color: point.foregroundColor || '#666' 
                                                                }} 
                                                            />
                                                        </div>
                                                        <span className="text-gray-300 text-sm">
                                                            {getTypeName(point.type)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-white text-sm font-medium">
                                                        {point.name}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-gray-300 text-sm font-mono">
                                                        {formatRelativeTime(point.time)}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-gray-300 text-sm font-mono">
                                                        {formatAbsoluteTime(point.time)}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <span className="text-gray-400 text-sm">
                                                        {point.note && point.note.trim() ? point.note : '-'}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    {point.url && point.url.trim() ? (
                                                        <a
                                                            href={point.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                                        >
                                                            <LaunchIcon sx={{ fontSize: 14 }} />
                                                            <span>查看</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* 移动端卡片列表 */}
                    <div className="block md:hidden">
                        <div className="p-2 space-y-3">
                            {points.map((point, index) => {
                                const IconComponent = iconMap[point.type] || StarIcon;
                                return (
                                    <div
                                        key={point.id}
                                        className="bg-white/5 rounded-lg p-3 border border-white/10"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center border"
                                                    style={{
                                                        backgroundColor: point.backgroundColor || 'rgba(255,255,255,0.1)',
                                                        borderColor: point.foregroundColor || '#666'
                                                    }}
                                                >
                                                    <IconComponent 
                                                        sx={{ 
                                                            fontSize: 12, 
                                                            color: point.foregroundColor || '#666' 
                                                        }} 
                                                    />
                                                </div>
                                                <div>
                                                    <div className="text-white text-sm font-medium">
                                                        {point.name}
                                                    </div>
                                                    <div className="text-gray-400 text-xs">
                                                        {getTypeName(point.type)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-gray-300 text-xs font-mono">
                                                    {formatRelativeTime(point.time)}
                                                </div>
                                                <div className="text-gray-400 text-xs font-mono">
                                                    {formatAbsoluteTime(point.time)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {point.note && point.note.trim() && (
                                            <div className="text-gray-400 text-sm mb-2">
                                                {point.note}
                                            </div>
                                        )}
                                        
                                        {point.url && point.url.trim() && (
                                            <a
                                                href={point.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                            >
                                                <LaunchIcon sx={{ fontSize: 14 }} />
                                                <span>查看详情</span>
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimelineTable;
