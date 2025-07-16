// src/components/LiveRecord/StreamTypeBadge.js
import React from 'react';
import { useLiveTypes } from '../../hooks/useLiveTypes';

const StreamTypeBadge = ({ title, type, className = '' }) => {
    // 使用live types hook
    const { liveTypes, getTypeColors, getTypeName, loading: liveTypesLoading } = useLiveTypes();
    
    // 获取纯净的标题（去除可能存在的类型标记）
    const getCleanTitle = (title) => {
        return title.replace(/【.+?】/, '').trim();
    };

    const cleanTitle = getCleanTitle(title);
    
    // 如果正在加载，显示基础样式
    if (liveTypesLoading) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <span className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap text-gray-500 border border-gray-300">
                    加载中...
                </span>
                <span className="text-gray-700 truncate">
                    {cleanTitle}
                </span>
            </div>
        );
    }

    // 如果没有type或找不到对应的类型数据，显示基础样式
    if (!type || !liveTypes[type]) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <span className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap text-gray-500 border border-gray-300">
                    {type || '未知类型'}
                </span>
                <span className="text-gray-700 truncate">
                    {cleanTitle}
                </span>
            </div>
        );
    }

    // 使用API获取颜色
    const colors = getTypeColors(type);
    
    // 如果API数据不存在，使用基础样式
    if (!colors) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <span className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap text-gray-500 border border-gray-300">
                    {getTypeName(type)}
                </span>
                <span className="text-gray-700 truncate">
                    {cleanTitle}
                </span>
            </div>
        );
    }
    
    const backgroundColor = colors[0].replace(/0\.\d+/, '0.2'); // 降低透明度
    const textColor = colors[1];
    
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
                {getTypeName(type)}
            </span>
            <span className="text-white font-bold flex-1 min-w-0 truncate">
                {cleanTitle}
            </span>
        </div>
    );
};

export default StreamTypeBadge;
