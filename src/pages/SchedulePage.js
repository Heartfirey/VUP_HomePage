import React from 'react';
import config from '../config';
import { BlackRawBlurCardNoAnimate as BlurCard } from '../components/RawBlurCard';
import ScheduleTable from '../components/Schedule/ScheduleTable';
import LiveTvTwoToneIcon from '@mui/icons-material/LiveTvTwoTone';

const live2dPNG = require(`../assets/${config.siteSettings.live2dFile1}`);
// 导入 bilibili 图标
const bilibiliIcon = require(`../assets/icon/bilibili.svg`).default;

const AboutPage = () => {
    // 处理前往空间点击
    const handleGoToSpace = () => {
        const bilibiliSpaceUrl = `https://space.bilibili.com/${config.anchorInfo.uid}`;
        window.open(bilibiliSpaceUrl, '_blank');
    };

    return (
        <div className='space-y-4'>
            <BlurCard className="flex overflow-hidden min-h-[150px] md:min-h-[200px] max-h-[200px]">

                <div className="w-2/5 md:w-2/5 flex items-end overflow-hidden">
                    <img
                        src={live2dPNG}
                        alt="Live2D"
                        className="w-full object-contain max-h-[calc(100%-10px)] md:max-h-[calc(100%-20px)]"
                    />
                </div>

                <div className="flex-1 p-2 md:p-4 flex flex-col justify-center text-left space-y-2 md:space-y-3">
                    <div className="relative">
                        <LiveTvTwoToneIcon className="text-white" sx={{ fontSize: { xs: 28, md: 40 } }}/>
                    </div>
                    <p className="font-bold text-xl md:text-3xl text-white break-words leading-tight">
                        {config.anchorInfo.name}的直播计划
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-2 md:mt-4">
                        {/* Go to space button */}
                        <button
                            onClick={handleGoToSpace}
                            className="flex items-center justify-center px-3 md:px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 
                                     border border-pink-400/30 hover:border-pink-400/50 
                                     rounded-lg transition-all duration-200 
                                     text-pink-100 hover:text-white text-xs md:text-sm font-medium
                                     min-w-0 flex-shrink-0"
                            title="前往 B站空间"
                        >
                            <img 
                                src={bilibiliIcon} 
                                alt="bilibili" 
                                className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2 filter brightness-0 invert opacity-80 flex-shrink-0"
                            />
                            <span className="truncate">前往空间</span>
                        </button>

                        {/* Subscribe calendar button - Reserved position, waiting for backend implementation */}
                        <button
                            className="flex items-center justify-center px-3 md:px-4 py-2 bg-gray-500/20 
                                     border border-gray-400/30 
                                     rounded-lg cursor-not-allowed opacity-50
                                     text-gray-300 text-xs md:text-sm font-medium
                                     min-w-0 flex-shrink-0"
                            title="日历订阅功能开发中..."
                            disabled
                        >
                            <svg 
                                className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2 flex-shrink-0" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">订阅日历</span>
                        </button>
                    </div>
                </div>
            </BlurCard>
            <ScheduleTable />
        </div>
    );
};

export default AboutPage;
