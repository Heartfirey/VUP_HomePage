// src/components/LiveRecord/RecordCard.js
import React, { useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { BlackRawBlurCardNoAnimate as BlurCard } from '../RawBlurCard';
import Timeline from './Timeline';
import TimelineTable from './TimelineTable';
import StreamTypeBadge from './StreamTypeBadge';

// 导入MUI图标
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LaunchIcon from '@mui/icons-material/Launch';

const RecordCard = ({ record, className }) => {
    const [tableExpanded, setTableExpanded] = useState(false);
    
    if (!record) return null;
    
    // 格式化时长
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h${mins}m` : `${mins}分钟`;
    };
    
    // 格式化数字（添加K、M后缀）
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };
    
    // 格式化日期
    const formatDate = (dateStr) => {
        const date = dayjs(dateStr);
        const now = dayjs();
        const diffDays = now.diff(date, 'day');
        
        if (diffDays === 0) {
            return '今天 ' + date.format('HH:mm');
        } else if (diffDays === 1) {
            return '昨天 ' + date.format('HH:mm');
        } else if (diffDays < 7) {
            return `${diffDays}天前 ` + date.format('HH:mm');
        } else {
            return date.format('MM-DD HH:mm');
        }
    };
    
    return (
        <BlurCard className={clsx("overflow-hidden", className)}>
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                {/* Header info */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-3 md:space-y-0">
                    <div className="flex-1 md:pr-6">
                        <div className="mb-2">
                            <StreamTypeBadge 
                                title={record.title} 
                                type={record.type} 
                                className="text-xl md:text-2xl leading-tight" 
                            />
                        </div>
                        
                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center space-x-1">
                                <CalendarTodayIcon sx={{ fontSize: 14 }} />
                                <span>{formatDate(record.streamTime)}</span>
                            </div>
                            {record.duration && (
                                <div className="flex items-center space-x-1">
                                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                                    <span>{formatDuration(record.duration)}</span>
                                </div>
                            )}
                            {record.viewCount && record.viewCount > 0 && (
                                <div className="flex items-center space-x-1">
                                    <VisibilityIcon sx={{ fontSize: 14 }} />
                                    <span>{formatNumber(record.viewCount)}</span>
                                </div>
                            )}
                            {record.likeCount && record.likeCount > 0 && (
                                <div className="flex items-center space-x-1">
                                    <ThumbUpIcon sx={{ fontSize: 14 }} />
                                    <span>{formatNumber(record.likeCount)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-3">
                        {record.replayUrl && (
                            <a
                                href={record.replayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 
                                         border border-pink-400/30 hover:border-pink-400/50 
                                         rounded-lg transition-all duration-200 
                                         text-pink-100 hover:text-white text-sm font-medium"
                            >
                                <PlayArrowIcon sx={{ fontSize: 16 }} />
                                <span className="hidden sm:inline">观看回放</span>
                                <span className="sm:hidden">回放</span>
                            </a>
                        )}
                        
                        {record.replayUrl && (
                            <a
                                href={record.replayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 
                                         border border-white/20 hover:border-white/30 
                                         rounded-lg transition-all duration-200 
                                         text-gray-300 hover:text-white"
                                title="在新窗口打开"
                            >
                                <LaunchIcon sx={{ fontSize: 16 }} />
                            </a>
                        )}
                    </div>
                </div>
                
                {/* Timeline */}
                <div className="space-y-4 relative">
                    <div className="flex items-center space-x-2">
                        <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full" />
                        <h3 className="text-lg font-medium text-white">直播时间轴</h3>
                        <div className="text-sm text-gray-400">
                            ({record.timelinePoints?.length || 0}个时间点)
                        </div>
                    </div>
                    
                    <div className="relative" style={{ zIndex: 20 }}>
                        <Timeline
                            points={record.timelinePoints || []}
                            streamStartTime={record.streamTime}
                            duration={record.duration}
                            className="bg-white/5 rounded-lg p-4 border border-white/10"
                        />
                    </div>
                </div>
                
                {/* Timeline details table */}
                <div className="relative" style={{ zIndex: 10 }}>
                    <TimelineTable
                        points={record.timelinePoints || []}
                        streamStartTime={record.streamTime}
                        isExpanded={tableExpanded}
                        onToggle={() => setTableExpanded(!tableExpanded)}
                    />
                </div>
                
                {/* Description and tags */}
                {(record.description || record.tags) && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                        {record.description && (
                            <div>
                                <h4 className="text-white font-medium mb-2">直播简介</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {record.description}
                                </p>
                            </div>
                        )}
                        
                        {record.tags && record.tags.length > 0 && (
                            <div>
                                <h4 className="text-white font-medium mb-2">标签</h4>
                                <div className="flex flex-wrap gap-2">
                                    {record.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-white/10 border border-white/20 
                                                     rounded-md text-xs text-gray-300"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </BlurCard>
    );
};

export default RecordCard;
