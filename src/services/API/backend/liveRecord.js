// src/services/API/backend/liveRecord.js
import dayjs from 'dayjs';
import apiClient from './apiClient';
import { safeThrow } from '../../../utils/exception_manage';

// API函数
export const liveRecordAPI = {
    // 获取一周的直播事件列表 - 复用现有的 weeks 接口，并筛选有录播的事件
    async getWeeklyLiveEvents(weekOffset = 0) {
        try {
            // 使用现有的 weeks 接口获取事件数据
            const response = await apiClient.get('/weeks', {
                params: { 
                    limit: 10, 
                    offset: weekOffset 
                }
            });
            
            // 转换数据格式以匹配前端期望的格式
            const weeks = response.data || [];
            const allEvents = [];
            
            // 提取所有事件
            weeks.forEach(week => {
                if (week.events && week.events.length > 0) {
                    week.events.forEach(event => {
                        allEvents.push({
                            id: `live_${dayjs(event.date).format('YYYYMMDD_HHmm')}_${event.id}`,
                            date: dayjs(event.date).format('YYYY-MM-DD'),
                            time: dayjs(event.date).format('HH:mm'),
                            title: event.title,
                            type: event.type,
                            eventId: event.id // 保存原始event ID
                        });
                    });
                }
            });
            
            // 如果没有事件，直接返回空结果
            if (allEvents.length === 0) {
                return {
                    success: true,
                    data: {
                        events: [],
                        weekOffset: weekOffset,
                        weekStart: null,
                        weekEnd: null,
                        hasMore: false
                    },
                    message: `第${weekOffset + 1}周暂无录播数据`
                };
            }
            
            // 批量检查哪些事件有录播数据
            const eventIds = allEvents.map(event => event.eventId).join(',');
            const checkResponse = await apiClient.get('/live-records/check-exist', {
                params: { event_ids: eventIds }
            });
            
            // 筛选出有录播数据的事件
            const eventsWithRecords = allEvents.filter(event => {
                return checkResponse.data.success && 
                       checkResponse.data.data[event.eventId.toString()] === true;
            });
            
            // 按时间倒序排列
            eventsWithRecords.sort((a, b) => dayjs(b.date + ' ' + b.time).unix() - dayjs(a.date + ' ' + a.time).unix());
            
            return {
                success: true,
                data: {
                    events: eventsWithRecords,
                    weekOffset: weekOffset,
                    weekStart: weeks.length > 0 ? dayjs().subtract(weekOffset, 'week').startOf('week').format('YYYY-MM-DD') : null,
                    weekEnd: weeks.length > 0 ? dayjs().subtract(weekOffset, 'week').endOf('week').format('YYYY-MM-DD') : null,
                    hasMore: eventsWithRecords.length >= 10 // 简单的判断方法
                },
                message: eventsWithRecords.length > 0 ? 
                        `获取第${weekOffset + 1}周录播事件成功` : 
                        `第${weekOffset + 1}周暂无录播数据`
            };
        } catch (error) {
            console.error('获取周直播事件失败:', error);
            return {
                success: false,
                data: {
                    events: [],
                    weekOffset,
                    weekStart: dayjs().subtract(weekOffset, 'week').startOf('week').format('YYYY-MM-DD'),
                    weekEnd: dayjs().subtract(weekOffset, 'week').endOf('week').format('YYYY-MM-DD'),
                    hasMore: false
                },
                message: error.message
            };
        }
    },

    // 获取单场直播的详细信息 - 使用 event_id
    async getLiveDetails(liveId) {
        try {
            // 从 liveId 中提取 eventId
            const parts = liveId.split('_');
            const eventId = parts[parts.length - 1];
            
            const response = await apiClient.get(`/live-records/details/${eventId}`);
            
            if (!response.data.success) {
                throw new Error(response.data.message || '获取直播详情失败');
            }
            
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('获取直播详情失败:', error);
            safeThrow(error);
        }
    },

    // 搜索直播事件（跨周搜索）
    async searchLiveEvents(keyword, weekOffset = 0, limit = 10) {
        try {
            const response = await apiClient.get('/live-records/search', {
                params: {
                    keyword,
                    week_offset: weekOffset,
                    limit
                }
            });
            
            if (!response.data.success) {
                throw new Error(response.data.message || '搜索失败');
            }
            
            return {
                success: true,
                data: {
                    events: response.data.data.events || [],
                    keyword: response.data.data.keyword,
                    total: response.data.data.total || 0
                },
                message: response.data.message
            };
        } catch (error) {
            console.error('搜索直播事件失败:', error);
            safeThrow(error);
        }
    }
};

export default liveRecordAPI;
