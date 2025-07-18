export default {
    anchorInfo: {
        roomId: '1791269118',
        uid: '3494370919581938',
        name: '水奈Rin',
        fanTag: '团奈米',
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
                【直播间点歌规则】<br />
                ♡ 灯牌≥5级可点歌（弹幕发送：点歌+歌名）<br />
                ♡ SC置顶，提督默认置顶；上舰置顶一首歌；<br />
                ♡ 歌单内标注付费歌曲30SC起；<br />
                ♡ CD：粉丝团30分钟，舰长10分钟，提督5分钟，总督无<br />
                【关于直播】<br />
                ♡ 日常直播时间：下午12:00，晚上21:00 <br />
                ♡ （每周三定休，具体以周表为准）<br />
                ♡ 日常直播内容：主歌杂，偶尔游戏/视频鉴赏<br />
                ♡ 唠嗑直播通知群：1049443660
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
       
        rowPerPage: 10
    },
    // Recording page configuration
    recordStyle: {
       
        recordsPerPage: 8
    },
    api: {
        backendAPIUrl: 'http://127.0.0.1:8080/api',
        // externalWatcherAPIUrl: 'https://ayln.top/exapi_vrpmoe'
        externalWatcherAPIUrl: 'http://127.0.0.1:8080/exapi_vrpmoe'
    },
}
