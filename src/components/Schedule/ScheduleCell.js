// src/components/ScheduleCell.js
import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useLiveTypes } from '../../hooks/useLiveTypes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// 导入类型图标
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StarIcon from '@mui/icons-material/Star';

const ScheduleCell = ({ events, isToday, maxEventsInWeek = 1 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    const { getTypeColors, getTypeName } = useLiveTypes();
    
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    const eventList = Array.isArray(events) ? events : [events];
    
    const validEvents = eventList.filter(event => event && (event.title || event.type === 'rest'));
    const displayEvents = validEvents.length > 0 ? validEvents : [{
        date: events.date || (Array.isArray(events) ? events[0]?.date : null),
        type: 'rest',
        title: '',
        cancelled: false
    }];
    
    // 判断是否为休息日（无具体安排）
    const isRestDay = displayEvents.length === 1 && displayEvents[0].type === 'rest' && !displayEvents[0].title;
    
    // 获取日期（从第一个事件）
    const dateString = displayEvents[0]?.date;
    const formattedDate = dateString ? dayjs(dateString).format('MM/DD') : '';
    const dayOfWeek = dateString ? dayjs(dateString).format('ddd') : '';

    const minHeight = isMobile ? 
        Math.max(80, 50 + maxEventsInWeek * 28) :  // 手机端更紧凑
        Math.max(100, 60 + maxEventsInWeek * 36);   // 桌面端紧凑优化

    // 检查事件是否已过期
    const isEventPast = (eventDate) => {
        const now = dayjs();
        const event = dayjs(eventDate);
        return event.isBefore(now, 'day') || (event.isSame(now, 'day') && event.isBefore(now));
    };

    // 获取类型对应的图标组件
    const getTypeIcon = (type) => {
        const iconMap = {
            'chat': ChatIcon,
            'collab': GroupIcon,
            'default': PlayArrowIcon,
            'game': SportsEsportsIcon,
            'sing': MusicNoteIcon,
            'special': StarIcon,
            'comments': ChatIcon,
            'users': GroupIcon,
            'play': PlayArrowIcon,
            'gamepad': SportsEsportsIcon,
            'music': MusicNoteIcon,
            'star': StarIcon
        };
        return iconMap[type] || PlayArrowIcon;
    };

    const EventItem = ({ event, isFirst = false }) => {
        const textRef = useRef(null);
        const containerRef = useRef(null);
        const [scrollSettings, setScrollSettings] = useState({
            needsScroll: false,
            scrollDistance: 0,
            duration: 6
        });
        
        const eventColors = getTypeColors(event.type);
        const { liveTypes } = useLiveTypes();
        
        const FALLBACK_BG_COLOR = 'rgba(156, 163, 175, 0.1)';
        const FALLBACK_FG_COLOR = 'rgb(156, 163, 175)';
        
        const eventBgColor = event.title ? 
            (eventColors ? eventColors[0] : FALLBACK_BG_COLOR) : 
            FALLBACK_BG_COLOR;
        const eventFgColor = event.title ? 
            (eventColors ? eventColors[1] : FALLBACK_FG_COLOR) : 
            FALLBACK_FG_COLOR;
            
        const eventTime = event.date ? dayjs(event.date).format('HH:mm') : '';
        const isPast = isEventPast(event.date);
        const title = event.title || '休息';
        
        const typeData = liveTypes[event.type];
        const iconType = typeData?.icon || event.type;
        const TypeIcon = getTypeIcon(iconType);
        
        useEffect(() => {
            if (!textRef.current || !containerRef.current) return;
            
            const textWidth = textRef.current.scrollWidth;
            const containerWidth = containerRef.current.clientWidth;
            
            const needsScroll = textWidth > containerWidth;
            const scrollDistance = needsScroll ? Math.min(textWidth - containerWidth + 10, textWidth * 0.6) : 0;
            const duration = needsScroll ? Math.max(4, title.length * 0.2) : 6;
            
            setScrollSettings({
                needsScroll,
                scrollDistance,
                duration
            });
        }, [title, isMobile]);
        
        const playState = isPast ? 'paused' : 'running';
        
        return (
            <div 
                className="rounded-lg transition-all duration-200 relative overflow-hidden"
                style={{
                    backgroundColor: eventBgColor,
                    opacity: isPast ? 0.7 : 1
                }}
            >
                <div className="p-1.5 md:p-2">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1 min-w-0 flex-1">
                            <div className="inline-flex items-center rounded-md text-xs font-medium text-white shadow-sm"
                            >
                                <TypeIcon 
                                    sx={{ 
                                        width: { xs: 12, md: 14 }, 
                                        height: { xs: 12, md: 14 }, 
                                        color: eventFgColor,
                                        opacity: 0.9,
                                        flexShrink: 0
                                    }} 
                                />
                                <span 
                                    className="text-xs px-1 py-0.5 rounded font-medium truncate"
                                    style={{ 
                                        color: eventFgColor
                                    }}
                                >
                                    {getTypeName(event.type)}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 flex-shrink-0">
                            {eventTime && (
                                <div className="text-xs text-gray-300 font-mono">
                                    {eventTime}
                                </div>
                            )}
                            {isPast ? (
                                <CheckCircleIcon 
                                    sx={{ 
                                        width: { xs: 10, md: 12 }, 
                                        height: { xs: 10, md: 12 }, 
                                        color: eventFgColor,
                                        opacity: 0.7,
                                        flexShrink: 0
                                    }} 
                                />
                            ) : (
                                <RadioButtonUncheckedIcon 
                                    sx={{ 
                                        width: { xs: 10, md: 12 }, 
                                        height: { xs: 10, md: 12 }, 
                                        color: eventFgColor,
                                        opacity: 0.7,
                                        flexShrink: 0
                                    }} 
                                />
                            )}
                        </div>
                    </div>
                    
                    <div 
                        ref={containerRef}
                        className="text-xs md:text-sm font-medium text-gray-100 leading-tight overflow-hidden scroll-container"
                    >
                        {event.cancelled ? (
                            <span className="line-through opacity-70">{title}</span>
                        ) : (
                            <div 
                                ref={textRef}
                                className={clsx(
                                    "whitespace-nowrap",
                                    scrollSettings.needsScroll && "scroll-text"
                                )}
                                style={{
                                    '--scroll-end': scrollSettings.needsScroll ? `-${scrollSettings.scrollDistance}px` : '0px',
                                    '--duration': `${scrollSettings.duration}s`,
                                    '--play-state': playState
                                }}
                            >
                                {title}
                            </div>
                        )}
                    </div>
                    
                    {event.reason && (
                        <div className="text-xs text-gray-400 mt-0.5 leading-tight truncate">
                            {event.reason}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 多事件显示逻辑
    const hasMultipleEvents = displayEvents.length > 1 && !isRestDay;
    const showExpandButton = hasMultipleEvents && displayEvents.length > 3;
    const visibleEvents = showExpandButton && !isExpanded ? 
        displayEvents.slice(0, 3) : displayEvents;

    return (
        <div
            className={clsx(
                'rounded-xl transition-all duration-300 backdrop-blur-sm overflow-hidden',
                isToday ? 
                    'bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-blue-500/20 ring-2 ring-pink-400/60 shadow-lg shadow-pink-500/20' : 
                    'bg-gradient-to-br from-white/8 via-white/5 to-white/3 hover:from-white/12 hover:via-white/8 hover:to-white/5',
                showExpandButton && 'cursor-pointer hover:scale-[1.02]',
                // 为休息日添加特殊的高度类 - 更紧凑
                isRestDay ? 'min-h-[70px] md:min-h-[90px]' : ''
            )}
            style={!isRestDay ? { minHeight: `${minHeight}px` } : {}}
            onClick={() => showExpandButton && setIsExpanded(!isExpanded)}
        >
            <div className="px-2 md:px-2.5 pt-1.5 md:pt-2 pb-1 border-b border-white/10">
                <div className="flex justify-between items-center min-w-0">
                    <div className={clsx(
                        'text-sm md:text-base font-bold flex-shrink-0',
                        isToday ? 'text-pink-200' : 'text-white'
                    )}>
                        {formattedDate}
                    </div>
                    
                    <div className="flex items-center space-x-1.5 md:space-x-1 min-w-0 flex-shrink-0">
                        <div className={clsx(
                            'text-xs font-medium whitespace-nowrap',
                            isToday ? 'text-pink-300/80' : 'text-gray-400'
                        )}>
                            {dayOfWeek}
                        </div>
                        {isToday && (
                            <div className="flex items-center space-x-1 flex-shrink-0">
                                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse flex-shrink-0" />
                                <span className="text-xs text-pink-300 font-medium whitespace-nowrap">今日</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col p-1.5 md:p-2">
                {isRestDay ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <BedtimeIcon 
                                sx={{ 
                                    fontSize: { xs: 20, md: 28 }, 
                                    color: 'rgb(156, 163, 175)',
                                    mb: 0.5
                                }} 
                            />
                            <div className="text-xs text-gray-400">休息</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col space-y-1 md:space-y-1.5">
                        {visibleEvents.map((event, index) => (
                            <EventItem 
                                key={`${event.date}-${event.type}-${index}`}
                                event={event} 
                                isFirst={index === 0}
                            />
                        ))}
                        
                        {showExpandButton && (
                            <div className="text-center pt-1 mt-auto">
                                <button 
                                    className="text-xs px-2 py-0.5 text-gray-300 hover:text-white 
                                             bg-white/5 hover:bg-white/10 rounded-full transition-all duration-200
                                             border border-white/10 hover:border-white/20 hover:scale-105"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(!isExpanded);
                                    }}
                                >
                                    {isExpanded ? 
                                        `收起 ↑` : 
                                        `+${displayEvents.length - 3} 更多`
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleCell;
