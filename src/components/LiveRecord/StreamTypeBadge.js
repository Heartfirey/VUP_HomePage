// src/components/LiveRecord/StreamTypeBadge.js
import React from 'react';
import config from '../../config';

const StreamTypeBadge = ({ title, className = '' }) => {
    // 从标题中提取直播类型
    const extractStreamType = (title) => {
        const match = title.match(/【(.+?)】/);
        return match ? match[1] : '直播';
    };
    
    // 获取纯净的标题（去除类型标记）
    const getCleanTitle = (title) => {
        return title.replace(/【.+?】/, '').trim();
    };
    
    // 映射中文类型到英文key
    const mapTypeToKey = (chineseType) => {
        const typeMap = {
            '歌回': 'sing',
            '游戏': 'game', 
            '闲聊': 'default', // 闲聊归类为默认直播类型
            '观影': 'watch',
            '翻译': 'sub',
            '电台': 'radio',
            '合作': 'collab',
            '休息': 'rest',
            '直播': 'default'
        };
        return typeMap[chineseType] || 'default';
    };
    
    const streamType = extractStreamType(title);
    const cleanTitle = getCleanTitle(title);
    const typeKey = mapTypeToKey(streamType);
    
    // 使用Schedule页面的配置
    const scheduleConfig = config.scheduleStyle.eventTypeColorMap[typeKey] || 
                          config.scheduleStyle.eventTypeColorMap['default'];
    
    // Schedule配置格式: [backgroundColor, textColor]
    // 对于Badge，我们需要降低背景透明度
    const backgroundColor = scheduleConfig[0].replace(/0\.\d+/, '0.2');
    const textColor = scheduleConfig[1];
    
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <span 
                className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow-sm border"
                style={{ 
                    backgroundColor, 
                    color: textColor,
                    borderColor: `${textColor}30`,
                    boxShadow: `0 0 8px ${backgroundColor}`
                }}
            >
                {streamType}
            </span>
            <span className="text-white font-bold flex-1 min-w-0 truncate">
                {cleanTitle}
            </span>
        </div>
    );
};

export default StreamTypeBadge;
