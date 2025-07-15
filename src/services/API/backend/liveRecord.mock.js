// src/services/API/backend/liveRecord.mock.js
// Mock version for development/testing when backend is not available
import dayjs from 'dayjs';

// Mock数据生成器 - 生成一周的直播事件
const generateWeeklyLiveEvents = (weekOffset = 0) => {
    const weekStart = dayjs().subtract(weekOffset, 'week').startOf('week');
    const events = [];
    
    // 模拟数据边界：超过12周就没有更多数据了
    if (weekOffset >= 12) {
        return [];
    }
    
    // 每周生成固定数量的直播（避免随机性导致的问题）
    const liveCount = weekOffset < 10 ? (3 + (weekOffset % 3)) : (weekOffset % 2 + 1);
    
    for (let i = 0; i < liveCount; i++) {
        // 随机选择一周内的某一天
        const dayOffset = Math.floor(Math.random() * 7);
        const hour = Math.floor(Math.random() * 6) + 19; // 19-24点
        const minute = Math.floor(Math.random() * 60);
        
        const liveDate = weekStart.add(dayOffset, 'day').hour(hour).minute(minute);
        const liveId = `live_${liveDate.format('YYYYMMDD_HHmm')}_${i}`;
        
        events.push({
            id: liveId,
            date: liveDate.format('YYYY-MM-DD'),
            time: liveDate.format('HH:mm'),
            title: `【${['歌回', '游戏', '闲聊', '观影', '翻译', '电台', '合作'][Math.floor(Math.random() * 7)]}】${liveDate.format('MM月DD日')}直播`,
            type: ['sing', 'game', 'default', 'watch', 'sub', 'radio', 'collab'][Math.floor(Math.random() * 7)]
        });
    }
    
    // 按时间排序
    return events.sort((a, b) => dayjs(b.date + ' ' + b.time).unix() - dayjs(a.date + ' ' + a.time).unix());
};

// 生成单场直播的详细信息
const generateLiveDetails = (liveId) => {
    // 从ID中解析时间信息
    const dateTimeMatch = liveId.match(/live_(\d{8})_(\d{4})/);
    let streamDate = dayjs();
    let streamDuration = Math.floor(Math.random() * 180) + 60;
    
    if (dateTimeMatch) {
        const [, dateStr, timeStr] = dateTimeMatch;
        const hour = parseInt(timeStr.substring(0, 2));
        const minute = parseInt(timeStr.substring(2, 4));
        streamDate = dayjs(dateStr, 'YYYYMMDD').hour(hour).minute(minute);
    }
    
    return {
        id: liveId,
        title: `【${['歌回', '游戏', '闲聊', '观影', '翻译', '电台', '合作'][Math.floor(Math.random() * 7)]}】${streamDate.format('MM月DD日')}直播`,
        streamTime: streamDate.format('YYYY-MM-DD HH:mm:ss'),
        duration: streamDuration,
        replayUrl: Math.random() > 0.1 ? `https://www.bilibili.com/video/BV1${Math.random().toString(36).substr(2, 9)}` : null,
        thumbnailUrl: `https://picsum.photos/320/180?random=${liveId}`,
        viewCount: Math.random() > 0.2 ? Math.floor(Math.random() * 50000) + 1000 : null,
        likeCount: Math.random() > 0.3 ? Math.floor(Math.random() * 5000) + 100 : null,
        timelinePoints: generateMockTimelinePoints(streamDate.toISOString(), streamDuration),
        description: '这是一场精彩的直播，包含了多个精彩时刻。',
        tags: ['直播', '互动']
    };
};

const generateMockTimelinePoints = (streamStartTime, streamDuration) => {
    const startTime = dayjs(streamStartTime);
    const endTime = startTime.add(streamDuration, 'minute');
    const points = [];
    
    // 开始节点
    points.push({
        id: `start_${Date.now()}`,
        type: 'start',
        name: '直播开始',
        time: startTime.unix(),
        url: '',
        note: '直播正式开始',
        backgroundColor: 'rgba(0, 230, 118, 0.3)',
        foregroundColor: 'rgba(0, 230, 118)'
    });
    
    // 随机生成一些节点
    const nodeTypes = ['song', 'milestone', 'chat', 'flag', 'break', 'highlight'];
    const nodeCount = Math.floor(Math.random() * 8) + 5; // 5-12个节点
    
    for (let i = 0; i < nodeCount; i++) {
        const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
        const randomTime = startTime.add(Math.random() * streamDuration, 'minute');
        
        const nodeNames = {
            song: ['海阔天空', ' 夜空中最亮的星', '青花瓷', '演员', '告白气球'],
            milestone: ['1000观众达成', '5000点赞', '100SC收到', '新粉丝团长'],
            chat: ['读弹幕环节', '回答问题', '闲聊时间', '互动游戏'],
            flag: ['立Flag不熬夜', '下次一定', '明天运动', '好好吃饭'],
            break: ['喝水休息', '技术性暂停', '短暂离开', '调试设备'],
            highlight: ['精彩瞬间', '爆笑时刻', '感动瞬间', '高能预警']
        };
        
        const generateNote = (type) => {
            // 30%概率返回空备注（模拟缺失数据）
            if (Math.random() < 0.3) {
                return '';
            }
            return type === 'milestone' ? '重要里程碑达成' : 
                   type === 'chat' ? '与观众互动' : 
                   type === 'break' ? '短暂休息' :
                   type === 'highlight' ? '精彩内容' :
                   type === 'song' ? '演唱歌曲' :
                   type === 'flag' ? 'Flag内容' : '其他内容';
        };

        const generateUrl = (type) => {
            // 40%概率返回空URL（模拟缺失链接）
            if (Math.random() < 0.4) {
                return '';
            }
            return type === 'song' ? `https://example.com/song/${i}` : 
                   type === 'highlight' ? `https://example.com/clip/${i}` : '';
        };

        points.push({
            id: `${type}_${randomTime.unix()}_${i}`,
            type,
            name: nodeNames[type][Math.floor(Math.random() * nodeNames[type].length)],
            time: randomTime.unix(),
            url: generateUrl(type),
            note: generateNote(type),
            backgroundColor: getTypeColor(type)[0],
            foregroundColor: getTypeColor(type)[1]
        });
    }
    
    // 结束节点
    points.push({
        id: `end_${Date.now()}`,
        type: 'end',
        name: '直播结束',
        time: endTime.unix(),
        url: '',
        note: '感谢观看，下次再见',
        backgroundColor: 'rgba(200,200,200,0.5)',
        foregroundColor: 'rgba(200,200,200,1)'
    });
    
    // 按时间排序
    return points.sort((a, b) => a.time - b.time);
};

const getTypeColor = (type) => {
    const colorMap = {
        song: ['rgba(255, 23, 68, 0.3)', 'rgb(255, 138, 128)'],
        milestone: ['rgba(255, 193, 7, 0.3)', 'rgb(255, 235, 59)'],
        chat: ['rgb(41, 121, 255, 0.3)', 'rgb(24, 255, 255)'],
        flag: ['rgba(255, 61, 0, 0.3)', 'rgb(255, 109, 0)'],
        start: ['rgba(0, 230, 118, 0.3)', 'rgba(0, 230, 118)'],
        end: ['rgba(200,200,200,0.5)', 'rgba(200,200,200,1)'],
        break: ['rgba(101, 31, 255, 0.2)', 'rgb(234, 128, 252)'],
        highlight: ['rgba(118, 255, 3, 0.3)', 'rgba(118, 255, 3,1)']
    };
    return colorMap[type] || colorMap.highlight;
};

// Mock API函数
export const liveRecordMockAPI = {
    // 获取一周的直播事件列表
    async getWeeklyLiveEvents(weekOffset = 0) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
        
        const events = generateWeeklyLiveEvents(weekOffset);
        const hasMore = weekOffset < 11; // 12周数据边界
        
        return {
            success: true,
            data: {
                events,
                weekOffset,
                weekStart: dayjs().subtract(weekOffset, 'week').startOf('week').format('YYYY-MM-DD'),
                weekEnd: dayjs().subtract(weekOffset, 'week').endOf('week').format('YYYY-MM-DD'),
                hasMore
            },
            message: `获取第${weekOffset + 1}周直播事件成功`
        };
    },

    // 获取单场直播的详细信息
    async getLiveDetails(liveId) {
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
        
        const details = generateLiveDetails(liveId);
        
        return {
            success: true,
            data: details,
            message: '获取直播详情成功'
        };
    },

    // 搜索直播事件（跨周搜索）
    async searchLiveEvents(keyword, weekOffset = 0, limit = 10) {
        await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600));
        
        // 生成最近几周的事件进行搜索
        let allEvents = [];
        for (let i = 0; i < 10; i++) {
            const weekEvents = generateWeeklyLiveEvents(weekOffset + i);
            allEvents.push(...weekEvents);
        }
        
        // 搜索过滤
        const filteredEvents = allEvents.filter(event => 
            event.title.includes(keyword)
        ).slice(0, limit);

        // 对于搜索结果，也需要获取详情
        const eventsWithDetails = await Promise.all(
            filteredEvents.map(async (event) => {
                const detailsResponse = await this.getLiveDetails(event.id);
                return detailsResponse.data;
            })
        );
        
        return {
            success: true,
            data: {
                events: eventsWithDetails,
                keyword,
                total: filteredEvents.length
            },
            message: `搜索"${keyword}"完成`
        };
    }
};

export default liveRecordMockAPI;
