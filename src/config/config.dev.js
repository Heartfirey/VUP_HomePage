export default {
    anchorInfo: {
        roomId: '1791269118',
        uid: '3494370919581938',
        name: '水奈Rin',
        fanTag: '待确定',
        copyright: '© 2025 水奈Rin',
    },
    siteSettings: {
        enableAurora: false,
        enableSplashCursor: false,
        enableSakuraParticles: false,
        enableHomepagePosts: true, // Control homepage post carousel display - Set to false to completely disable homepage post cards
        avatarFile: 'barAvatar.png',
        backgroundFile: 'sakuraBackground.png',
        live2dFile1: 'l2d_up.png',
        live2dFile2: 'l2d_flip.png',
        RulesTitle: '点歌规则',
        RulesContent: () => {
            return (
                <>
                    ♡ 点歌示范：发送弹幕 点歌+歌名<br />
                    ♡ 曲风偏好：国风 和 流行<br />
                    ♡ 粉丝团成员每日可点 一首歌<br />
                    ♡ 置顶歌曲：30SC<br />
                    ♡ 歌单内SC歌曲：30SC起<br />
                    ♡ 提督点歌默认置顶<br />
                    ♡ 点歌CD：10分钟<br />
                    ♡ 歌曲冷却时间：48小时<br />
                </>
            )
        }
    },
    // Performance monitoring configuration - Development environment
    performanceMonitor: {
        enableBlurMonitor: true, // Enable blur effect monitoring
        enablePerformancePanel: true, // Enable performance panel
        enableConsoleLogging: true, // Enable console logging
        monitorPosition: 'top-left', // Monitor panel position: top-right, top-left, bottom-right, bottom-left
        autoExpand: false, // Whether to auto-expand detailed information
        updateInterval: 500, // Monitor update interval (ms)
    },
    scheduleStyle: {
        eventTypeColorMap: {
            rest: ['rgba(200,200,200,0.5)', 'rgba(200,200,200,1)'],
            radio: ['rgba(118, 255, 3, 0.3)', 'rgba(118, 255, 3,1)'],
            watch: ['rgba(101, 31, 255, 0.2)', 'rgb(234, 128, 252)'],
            sub: ['rgba(0, 230, 118, 0.3)', 'rgba(0, 230, 118)'],
            game: ['rgb(41, 121, 255, 0.3)', 'rgb(24, 255, 255)'],
            collab: ['rgba(255, 61, 0, 0.3)', 'rgb(255, 109, 0)'],
            sing: ['rgb(255, 23, 68, 0.3)', 'rgb(255, 138, 128)'],
            default: ['rgba(255, 193, 7, 0.3)', 'rgb(255, 235, 59)']
        },
        eventMap: {
            rest: '休息',
            radio: '电台',
            watch: '观影',
            sub: '翻译',
            game: '游戏',
            collab: '合作',
            sing: '歌回',   
            default: '直播'
        },
        rowPerPage: 10
    },
    // Recording page configuration
    recordStyle: {
        // Timeline node type icon mapping
        timelineTypeIconMap: {
            song: 'MusicNoteIcon',
            milestone: 'EmojiEventsIcon', 
            chat: 'ChatBubbleIcon',
            flag: 'FlagIcon',
            start: 'PlayArrowIcon',
            end: 'StopIcon',
            break: 'PauseIcon',
            highlight: 'StarIcon'
        },
        // Timeline node type color mapping
        timelineTypeColorMap: {
            song: ['rgba(255, 23, 68, 0.3)', 'rgb(255, 138, 128)'],
            milestone: ['rgba(255, 193, 7, 0.3)', 'rgb(255, 235, 59)'],
            chat: ['rgb(41, 121, 255, 0.3)', 'rgb(24, 255, 255)'],
            flag: ['rgba(255, 61, 0, 0.3)', 'rgb(255, 109, 0)'],
            start: ['rgba(0, 230, 118, 0.3)', 'rgba(0, 230, 118)'],
            end: ['rgba(200,200,200,0.5)', 'rgba(200,200,200,1)'],
            break: ['rgba(101, 31, 255, 0.2)', 'rgb(234, 128, 252)'],
            highlight: ['rgba(118, 255, 3, 0.3)', 'rgba(118, 255, 3,1)']
        },
        // Timeline node type name mapping
        timelineTypeNameMap: {
            song: '歌曲',
            milestone: '里程碑',
            chat: '聊天',
            flag: 'Flag',
            start: '开始',
            end: '结束',
            break: '休息',
            highlight: '高光'
        },
        recordsPerPage: 8
    },
    api: {
        backendAPIUrl: 'http://127.0.0.1:8080/api',
        externalWatcherAPIUrl: 'https://ayln.top/exapi_vrpmoe'
    },
}
