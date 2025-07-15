// src/components/LiveRecord/Timeline.js
import React, { useState } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import config from '../../config';

// 导入MUI图标
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FlagIcon from '@mui/icons-material/Flag';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import StarIcon from '@mui/icons-material/Star';

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

const Timeline = ({ points = [], streamStartTime, duration, className }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null);
    
    if (!points || points.length === 0) {
        return (
            <div className={clsx("flex items-center justify-center p-8", className)}>
                <div className="text-gray-400 text-sm">暂无时间轴数据</div>
            </div>
        );
    }
    
    // 按时间排序点
    const sortedPoints = [...points].sort((a, b) => a.time - b.time);
    
    // 均匀分布时间点位置（不按真实时间比例）
    const getPointPosition = (index, totalPoints) => {
        if (totalPoints === 1) return 50; // 单个点居中
        
        // 留出两边的边距，在中间区域均匀分布
        const leftMargin = 5; // 5%
        const rightMargin = 5; // 5%
        const availableWidth = 100 - leftMargin - rightMargin; // 90%
        
        if (totalPoints === 2) {
            return index === 0 ? leftMargin + availableWidth * 0.2 : leftMargin + availableWidth * 0.8;
        }
        
        // 多个点的情况，均匀分布
        const step = availableWidth / (totalPoints - 1);
        return leftMargin + (index * step);
    };
    
    // 格式化时间显示
    const formatTime = (timestamp) => {
        const time = dayjs.unix(timestamp);
        const streamStart = dayjs(streamStartTime);
        const diff = time.diff(streamStart, 'minute');
        
        if (diff < 60) {
            return `${diff}分钟`;
        } else {
            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;
            return `${hours}小时${minutes}分钟`;
        }
    };
    
    const TimelinePoint = ({ point, position, index }) => {
        const IconComponent = iconMap[point.type] || StarIcon;
        const isHovered = hoveredPoint === point.id;
        const isSelected = selectedPoint === point.id;
        
        return (
            <div
                className="absolute transform -translate-x-1/2"
                style={{ 
                    left: `${position}%`,
                    zIndex: isHovered || isSelected ? 50 : 20
                }}
            >
                {/* Points on timeline */}
                <div
                    className={clsx(
                        "relative cursor-pointer transition-all duration-200",
                        "hover:scale-110"
                    )}
                    onMouseEnter={() => setHoveredPoint(point.id)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => setSelectedPoint(isSelected ? null : point.id)}
                >
                    {/* Connection line */}
                    <div 
                        className="w-0.5 h-6 mx-auto mb-1"
                        style={{ backgroundColor: point.foregroundColor || '#666' }}
                    />
                    
                    {/* Icon point */}
                    <div
                        className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            "border-2 transition-all duration-200",
                            isHovered && "shadow-lg scale-110",
                            isSelected && "ring-2 ring-white ring-opacity-50"
                        )}
                        style={{
                            backgroundColor: point.backgroundColor || 'rgba(255,255,255,0.1)',
                            borderColor: point.foregroundColor || '#666'
                        }}
                    >
                        <IconComponent 
                            sx={{ 
                                fontSize: 16, 
                                color: point.foregroundColor || '#666' 
                            }} 
                        />
                    </div>
                    
                    {/* Hover bubble - Smart positioning to avoid overflow */}
                    {(isHovered || isSelected) && (
                        <div 
                            className={clsx(
                                "absolute left-1/2 transform -translate-x-1/2",
                                "bg-black/95 text-white text-xs rounded-lg p-3 min-w-max",
                                "shadow-xl backdrop-blur-sm border border-white/20"
                            )}
                            style={{
                                top: '50px',
                                zIndex: 1000,
                                // 智能调整水平位置避免越界
                                left: position < 20 ? '0%' : position > 80 ? '-100%' : '-50%',
                                transform: position < 20 ? 'translateX(0%)' : position > 80 ? 'translateX(0%)' : 'translateX(-50%)'
                            }}
                        >
                            <div className="font-medium">{point.name}</div>
                            <div className="text-gray-300 mt-1">
                                {formatTime(point.time)}
                            </div>
                            {point.note && point.note.trim() && (
                                <div className="text-gray-400 mt-1 text-xs">
                                    {point.note}
                                </div>
                            )}
                            {point.url && point.url.trim() && (
                                <a 
                                    href={point.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 text-xs mt-1 block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    🔗 查看详情
                                </a>
                            )}
                            
                            {/* Arrow pointing to point - Adjust based on position */}
                            <div 
                                className="absolute"
                                style={{
                                    top: '-4px',
                                    left: position < 20 ? '12px' : position > 80 ? 'calc(100% - 16px)' : '50%',
                                    transform: position < 20 || position > 80 ? 'translateX(-50%)' : 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '4px solid transparent',
                                    borderRight: '4px solid transparent',
                                    borderBottom: '4px solid rgba(0,0,0,0.95)'
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };
    
    return (
        <div className={clsx("relative", className)}>
            {/* Mobile: Vertical timeline */}
            <div className="block md:hidden">
                <div className="relative pl-8">
                    {/* Vertical main line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-600 via-gray-400 to-gray-600" />
                    
                    {sortedPoints.map((point, index) => {
                        const IconComponent = iconMap[point.type] || StarIcon;
                        return (
                            <div key={point.id} className="relative mb-6">
                                {/* Horizontal connection line */}
                                <div 
                                    className="absolute left-0 top-4 w-4 h-0.5"
                                    style={{ backgroundColor: point.foregroundColor || '#666' }}
                                />
                                
                                {/* Icon */}
                                <div
                                    className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center"
                                    style={{
                                        backgroundColor: point.backgroundColor || 'rgba(255,255,255,0.1)',
                                        borderColor: point.foregroundColor || '#666',
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    <IconComponent 
                                        sx={{ 
                                            fontSize: 16, 
                                            color: point.foregroundColor || '#666' 
                                        }} 
                                    />
                                </div>
                                
                                {/* Content card */}
                                <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-white text-sm">{point.name}</h4>
                                        <span className="text-xs text-gray-400 ml-2">
                                            {formatTime(point.time)}
                                        </span>
                                    </div>
                                    {point.note && point.note.trim() && (
                                        <p className="text-gray-300 text-xs mb-2">{point.note}</p>
                                    )}
                                    {point.url && point.url.trim() && (
                                        <a 
                                            href={point.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-xs"
                                        >
                                            🔗 查看详情
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Desktop: Horizontal timeline */}
            <div className="hidden md:block">
                <div className="relative mb-4" style={{ height: '80px', paddingBottom: '20px' }}>
                    {/* Main timeline */}
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600" />
                    
                    {/* Time points - Evenly distributed */}
                    {sortedPoints.map((point, index) => (
                        <TimelinePoint
                            key={point.id}
                            point={point}
                            position={getPointPosition(index, sortedPoints.length)}
                            index={index}
                        />
                    ))}
                </div>
                
                {/* Time scale - Show actual time range */}
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>
                        {sortedPoints.length > 0 ? formatTime(sortedPoints[0].time) : '开始'}
                    </span>
                    <span>总时长: {Math.floor(duration / 60)}h{duration % 60}m</span>
                    <span>
                        {sortedPoints.length > 0 ? formatTime(sortedPoints[sortedPoints.length - 1].time) : '结束'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
