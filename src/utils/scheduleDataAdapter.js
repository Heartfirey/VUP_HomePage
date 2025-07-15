// src/utils/scheduleDataAdapter.js
import dayjs from 'dayjs';

/**
 * 为指定的周生成完整的7天多事件数据结构
 * @param {Object} weekData - 周数据对象
 * @returns {Array} 包含7天数据的数组，每天是一个事件数组
 */
export const generateFullWeekMultiEvents = (weekData) => {
    if (!weekData) {
        return generateEmptyWeek();
    }

    const events = weekData.events || [];
    const fullWeek = [];
    
    // 确定周的开始日期
    let startOfWeek;
    
    if (events.length > 0) {
        const eventDates = events.map(event => dayjs(event.date));
        eventDates.sort((a, b) => a.unix() - b.unix());
        startOfWeek = eventDates[0].startOf('week').add(1, 'day'); // 周一开始
    } else {
        startOfWeek = dayjs().startOf('week').add(1, 'day');
    }

    // 为每一天生成事件数组
    for (let i = 0; i < 7; i++) {
        const currentDay = startOfWeek.add(i, 'day');
        const dateKey = currentDay.format('YYYY-MM-DD');
        
        // 查找当天的所有事件
        const dayEvents = events.filter(event => {
            const eventDateStr = dayjs(event.date).format('YYYY-MM-DD');
            return eventDateStr === dateKey;
        });
        
        if (dayEvents.length > 0) {
            // 按时间排序当天的事件
            dayEvents.sort((a, b) => {
                const timeA = dayjs(a.date).format('HH:mm');
                const timeB = dayjs(b.date).format('HH:mm');
                return timeA.localeCompare(timeB);
            });
            fullWeek.push(dayEvents);
        } else {
            // 创建休息日占位
            fullWeek.push([{
                date: dateKey,
                type: 'rest',
                title: '',
                cancelled: false,
                reason: ''
            }]);
        }
    }

    return fullWeek;
};

/**
 * 生成空的一周数据（7天休息日）
 * @returns {Array} 包含7个休息日的数组
 */
const generateEmptyWeek = () => {
    const startOfWeek = dayjs().startOf('week').add(1, 'day');
    const emptyWeek = [];
    
    for (let i = 0; i < 7; i++) {
        const currentDay = startOfWeek.add(i, 'day');
        emptyWeek.push([{
            date: currentDay.format('YYYY-MM-DD'),
            type: 'rest',
            title: '',
            cancelled: false,
            reason: ''
        }]);
    }
    
    return emptyWeek;
};
