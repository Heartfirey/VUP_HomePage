// 临时测试版本 - 直接使用后端数据，不做7天补齐
// src/components/Schedule/WeekRowSimple.js
import React from 'react';
import dayjs from 'dayjs';
import ScheduleCell from './ScheduleCell';

const WeekRowSimple = ({ weekData, todayDate }) => {
    console.log('WeekRowSimple 接收到的数据:', weekData);

    return (
        <div className="mb-4">
            <div className="text-left font-bold mb-2 text-pink-100">
                {`${weekData.year} 年第 ${weekData.week} 周 (原始数据：${weekData.events?.length || 0}个事件)`}
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-7">
                {weekData.events && weekData.events.map((event, index) => {
                    const eventDay = dayjs(event.date).format('YYYY-MM-DD');
                    const isToday = dayjs(todayDate).format('YYYY-MM-DD') === eventDay;
                    console.log(`渲染事件 ${index}:`, event);
                    return <ScheduleCell key={`${eventDay}-${index}`} event={event} isToday={isToday} />;
                })}
            </div>
        </div>
    );
};

export default WeekRowSimple;
