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
    // Performance monitoring configuration - Production environment
    performanceMonitor: {
        enableBlurMonitor: false, // Disable blur effect monitoring in production
        enablePerformancePanel: false, // Disable performance panel
        enableConsoleLogging: false, // Disable console logging
        monitorPosition: 'top-right',
        autoExpand: false,
        updateInterval: 1000,
    },
    scheduleStyle: {
       rowPerPage: 10
    },
    // Recording page configuration
    recordStyle: {
        
        rowPerPage: 10
    },
    api: {
        backendAPIUrl: 'https://rins.top/api',
        externalWatcherAPIUrl: 'https://ayln.top/exapi_vrpmoe'
    },
}
