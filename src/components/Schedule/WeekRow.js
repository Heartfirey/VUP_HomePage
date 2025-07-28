// src/components/WeekRow.js
import React from 'react';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import ScheduleCell from './ScheduleCell';
import { generateFullWeekMultiEvents } from '../../utils/scheduleDataAdapter';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

// 扩展 dayjs 以支持 week 功能
dayjs.extend(weekOfYear);

// 导入 bilibili 图标
const bilibiliIcon = require('../../assets/icon/bilibili.svg').default;

const WeekRow = ({ weekData, todayDate }) => {
    // 使用新的数据适配器生成完整的一周数据
    const fullWeekEvents = generateFullWeekMultiEvents(weekData);
    
    // 计算这一周内最多的事件数（排除休息日）
    const maxEventsInWeek = Math.max(...fullWeekEvents.map(dayEvents => {
        const activeEvents = dayEvents.filter(event => event.title && event.type !== 'rest');
        return activeEvents.length || 1; // 至少为1，确保有基础高度
    }));

    // 生成周期显示文本
    const generateWeekRangeText = () => {
        if (!fullWeekEvents || fullWeekEvents.length === 0) {
            return `${weekData.year} 年第 ${weekData.week} 周`;
        }

        // 获取第一天和最后一天的日期
        const firstDay = dayjs(fullWeekEvents[0][0]?.date);
        const lastDay = dayjs(fullWeekEvents[6][0]?.date);

        if (!firstDay.isValid() || !lastDay.isValid()) {
            return `${weekData.year} 年第 ${weekData.week} 周`;
        }

        const startYear = firstDay.year();
        const startMonth = firstDay.month() + 1;
        const startDate = firstDay.date();
        
        const endYear = lastDay.year();
        const endMonth = lastDay.month() + 1;
        const endDate = lastDay.date();

        let dateRangeText = `${startYear}年${startMonth}月${startDate}日`;

        // 判断是否跨年或跨月
        if (startYear !== endYear) {
            // 跨年
            dateRangeText += ` - ${endYear}年${endMonth}月${endDate}日`;
        } else if (startMonth !== endMonth) {
            // 跨月但不跨年
            dateRangeText += ` - ${endMonth}月${endDate}日`;
        } else {
            // 同年同月
            dateRangeText += ` - ${endDate}日`;
        }

        return dateRangeText;
    };

    // 处理 bilibili 链接点击
    const handleBilibiliClick = () => {
        if (weekData.bilibili_url) {
            // 如果是完整的 URL，直接打开
            if (weekData.bilibili_url.startsWith('http')) {
                window.open(weekData.bilibili_url, '_blank');
            } else {
                // 如果只是 ID，构建完整的 bilibili URL
                window.open(`https://www.bilibili.com/video/${weekData.bilibili_url}`, '_blank');
            }
        }
    };

    return (
        <div className="mb-6">
            {/* 美化的周标题 - 移动端优化 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 p-3 md:p-4 
                          rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 
                          border border-white/10 backdrop-blur-sm">
                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                    <div className="p-1.5 md:p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex-shrink-0">
                        <CalendarMonthIcon 
                            sx={{ 
                                fontSize: { xs: 16, md: 20 }, 
                                color: 'rgb(251, 207, 232)' // pink-200
                            }} 
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-sm md:text-lg font-bold text-pink-100 break-words leading-tight">
                            {generateWeekRangeText()}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                            第 {weekData.week} 周
                        </div>
                    </div>
                </div>
                {/* bilibili 链接按钮 - 移动端优化 */}
                {weekData.bilibili_url && weekData.bilibili_url.trim() !== '' && (
                    <button
                        onClick={handleBilibiliClick}
                        className="flex items-center justify-center px-3 md:px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 
                                 hover:from-pink-500/30 hover:to-purple-500/30
                                 border border-pink-400/40 hover:border-pink-400/60 
                                 rounded-lg transition-all duration-200 
                                 text-pink-100 hover:text-white text-xs md:text-sm font-medium
                                 backdrop-blur-sm hover:scale-105 shadow-lg hover:shadow-pink-500/20
                                 w-full sm:w-auto flex-shrink-0"
                        title="查看本周 B站动态"
                    >
                        <img 
                            src={bilibiliIcon} 
                            alt="bilibili" 
                            className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2 filter brightness-0 invert opacity-80 flex-shrink-0"
                        />
                        <span className="truncate">B站动态</span>
                    </button>
                )}
            </div>
            
            {/* 响应式网格布局 - 更紧凑的间距 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-1.5 md:gap-2">
                {fullWeekEvents.map((dayEvents, index) => {
                    // dayEvents 现在是一个事件数组
                    const eventDay = dayEvents[0]?.date ? dayjs(dayEvents[0].date).format('YYYY-MM-DD') : '';
                    const isToday = dayjs(todayDate).format('YYYY-MM-DD') === eventDay;
                    return (
                        <ScheduleCell 
                            key={`${eventDay}-${index}`} 
                            events={dayEvents} 
                            isToday={isToday}
                            maxEventsInWeek={maxEventsInWeek}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default WeekRow;
