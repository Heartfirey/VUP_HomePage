// src/components/Schedule/MultiEventDemo.js
import React from 'react';
import ScheduleCell from './ScheduleCell';
import dayjs from 'dayjs';

const MultiEventDemo = () => {
    // 演示多事件数据结构
    const multiEventDay = [
        {
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            type: 'radio',
            title: '早间电台',
            cancelled: false,
            reason: ''
        },
        {
            date: dayjs().add(4, 'hour').format('YYYY-MM-DD HH:mm:ss'),
            type: 'game',
            title: '午间游戏',
            cancelled: false,
            reason: ''
        },
        {
            date: dayjs().add(8, 'hour').format('YYYY-MM-DD HH:mm:ss'),
            type: 'sing',
            title: '晚间歌回',
            cancelled: false,
            reason: '特别歌会'
        }
    ];

    const singleEventDay = [
        {
            date: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
            type: 'collab',
            title: '联动直播',
            cancelled: false,
            reason: ''
        }
    ];

    const restDay = [
        {
            date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
            type: 'rest',
            title: '',
            cancelled: false,
            reason: ''
        }
    ];

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold text-white mb-4">多事件日程表演示</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 多事件的一天 */}
                <div>
                    <h3 className="text-white mb-2">多事件的一天 (3个事件)</h3>
                    <ScheduleCell events={multiEventDay} isToday={true} />
                </div>

                {/* 单事件的一天 */}
                <div>
                    <h3 className="text-white mb-2">单事件的一天</h3>
                    <ScheduleCell events={singleEventDay} isToday={false} />
                </div>

                {/* 休息日 */}
                <div>
                    <h3 className="text-white mb-2">休息日</h3>
                    <ScheduleCell events={restDay} isToday={false} />
                </div>
            </div>

            <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-white text-lg font-bold mb-2">新的数据结构说明：</h3>
                <div className="text-gray-300 text-sm space-y-2">
                    <p>• <strong>旧结构：</strong> 每天一个事件对象</p>
                    <p>• <strong>新结构：</strong> 每天一个事件数组，支持多个事件</p>
                    <p>• <strong>兼容性：</strong> 组件同时支持新旧两种数据结构</p>
                    <p>• <strong>交互：</strong> 超过2个事件时显示展开/收起按钮</p>
                    <p>• <strong>视觉：</strong> 每个事件有独立的颜色和时间显示</p>
                </div>
            </div>
        </div>
    );
};

export default MultiEventDemo;
