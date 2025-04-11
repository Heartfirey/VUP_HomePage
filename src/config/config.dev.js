export default {
    anchorInfo: {
        roomId: '31291629',
        uid: '3494371731180011',
        name: '阿音Ayln',
        copyright: '© 2025 雪域provealms',
    },
    siteSettings: {
        enableAurora: false,
        enableSplashCursor: true,
        enableSakuraParticles: false,
        avatarFile: 'aylnAvatar.png',
        backgroundFile: 'sakuraBackground.png',
        live2dFile1: 'l2d_up.png', 
        live2dFile2: 'l2d_flip.png',
        RulesTitle: '点歌规则',
        RulesContent: () => {
            return (
                <>
                    ♡ 点歌示范：发送弹幕 点歌+歌名<br/>
                    ♡ 曲风偏好：国风 和 流行<br/>
                    ♡ 粉丝团成员每日可点 一首歌<br/>
                    ♡ 置顶歌曲：30SC<br/>
                    ♡ 歌单内SC歌曲：30SC起<br/>
                    ♡ 提督点歌默认置顶<br/>
                    ♡ 点歌CD：10分钟<br/>
                    ♡ 歌曲冷却时间：48小时<br/>
                </>
            )
        }
    },
    api: {
        backendAPIUrl: 'https://ayln.top/api',
    },
}
