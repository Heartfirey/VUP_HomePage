// MainPage.jsx
import React from 'react';
import config from '../config';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSongNum } from '../store/songNumSlice';
import { fetchRoomInfo } from '../store/bilibiliLiveSlice';
import { RawBlurCardNoAnimate } from '../components/RawBlurCard';
import { CardSwitcher } from '../components/SpotlightBlurCard';
import SearchCard from '../components/SearchCard';
import SearchResultCard from '../components/SearchResultCard';
import HomepagePostCard from '../components/HomepagePostCard';
import VariableProximity from '../animations/VariableProximity';
import BlurText from '../animations/BlurText';
import CountUp from '../animations/CountUp';
import LiveStatusButton from '../components/LiveStatusButton';

import { Button } from '@mui/material';
import { toggleCard } from '../store/cardSwitcherSlice';
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

const live2dPNG = require(`../assets/${config.siteSettings.live2dFile1}`);
const live2dPNG2 = require(`../assets/${config.siteSettings.live2dFile2}`);

const MainPage = React.memo(() => {
    const containerRef = useRef(null);
    const dispatch = useDispatch();
    const { songNum } = useSelector((state) => state.songNum);
    const { roomInfo } = useSelector(state => state.bilibiliLive);

    useEffect(() => {
        dispatch(fetchSongNum());
        dispatch(fetchRoomInfo());
    }, [dispatch]);

    return (
        <div className="space-y-4">
            <CardSwitcher>
                <RawBlurCardNoAnimate className="flex overflow-hidden min-h-[250px] md:min-h-[300px] max-h-[300px]">
                    <div className="w-4/5 md:w-2/5 flex items-end overflow-hidden">
                        <img
                            src={live2dPNG}
                            alt="Live2D"
                            className="w-full object-contain max-h-[calc(100%-10px) md:max-h-[calc(100%-20px)]"
                        />
                    </div>

                    <div className="flex-1 p-2 flex flex-col justify-center text-left space-y-3">
                        <div ref={containerRef} className="relative">
                            <VariableProximity
                                label={config.anchorInfo.name + '的直播间'}
                                className="variable-proximity-demo text-3xl font-bold md:text-5xl"
                                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                                containerRef={containerRef}
                                radius={100}
                                falloff="gaussian"
                            />
                        </div>
                        <p className="text-2xl md:text-3xl">
                            和她拿手的
                            <CountUp
                                from={0}
                                to={songNum}
                                separator=","
                                direction="up"
                                duration={1}
                                className="count-up-text"
                            />
                            首歌
                        </p>
                        <div className="flex flex-row items-left mt-2 space-x-3">

                            <LiveStatusButton
                                liveStatus={roomInfo?.live_status}
                                liveTitle={roomInfo?.title}
                                loading={false}
                            />
                        </div>
                        <div className="flex flex-row items-left mt-2 space-x-3">
                            <Button sx={{
                                borderRadius: '8px',
                                px: 2.5, py: 1.2,
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                textTransform: 'none',
                                position: 'relative',
                                overflow: 'hidden',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                background: '#2196F3',
                                color: '#FFFFFF',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: '-100%',
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                    transition: 'left 0.5s ease',
                                },
                                '&:hover': {
                                    background: '#1976D2',
                                    border: '1px solid rgba(255, 255, 255, 0.4)',
                                    boxShadow: '0 6px 24px rgba(33, 150, 243, 0.4)',
                                    transform: 'translateY(-2px) scale(1.02)',
                                    '&:before': {
                                        left: '100%',
                                    }
                                },
                                '&:active': {
                                    transform: 'translateY(0) scale(0.98)',
                                    transition: 'all 0.1s ease',
                                },
                            }}
                                startIcon={<QueueMusicRoundedIcon />}
                                variant="contained"
                                onClick={() => dispatch(toggleCard())}>
                                {config.siteSettings.RulesTitle}
                            </Button>
                        </div>
                    </div>
                </RawBlurCardNoAnimate>
                <RawBlurCardNoAnimate className="flex overflow-hidden min-h-[250px] md:min-h-[300px] max-h-[300px]">
                    <div className="hidden sm:flex relative w-2/5 sm:w-[35%] items-end overflow-hidden">
                        <img
                            src={live2dPNG2}
                            alt="Live2D"
                            className="w-full object-contain max-h-[calc(100%-20px)]"
                        />
                    </div>

                    <div className="flex-1 md:p-2 flex flex-col justify-center text-left space-y-3">
                        <div className='m-4 md:m-2 p-2 md:p-0'>
                            <div className='flex flex-row items-center justify-between'>
                                <div className='flex flex-col'>
                                    <BlurText
                                        text={config.siteSettings.RulesTitle}
                                        delay={150}
                                        animateBy="letters"
                                        direction="top"
                                        className="font-bold text-2xl mb-2"
                                    />
                                </div>
                                <div className='flex flex-col'>
                                    <Button sx={{
                                        borderRadius: '8px',
                                        px: 2.5, py: 1.2,
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        textTransform: 'none',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: '#FFFFFF',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        minWidth: '80px',
                                        '&:before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: '-100%',
                                            width: '100%',
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                                            transition: 'left 0.6s ease',
                                            pointerEvents: 'none',
                                        },
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                            border: '1px solid rgba(255, 255, 255, 0.4)',
                                            boxShadow: '0 6px 24px rgba(102, 126, 234, 0.4)',
                                            transform: 'translateY(-2px) scale(1.05)',
                                            '&:before': {
                                                left: '100%',
                                            }
                                        },
                                        '&:active': {
                                            transform: 'translateY(0) scale(1.02)',
                                            transition: 'all 0.1s ease',
                                        },
                                    }}
                                        startIcon={<ArrowBackRoundedIcon />}
                                        variant="contained"
                                        onClick={() => dispatch(toggleCard())}>
                                        返回
                                    </Button>
                                </div>
                            </div>
                            <div className="flex max-h-[160px] md:max-h-[200px] overflow-auto">{config.siteSettings.RulesContent()}</div>
                        </div>

                    </div>
                </RawBlurCardNoAnimate>
            </CardSwitcher>

            {config.siteSettings.enableHomepagePosts && <HomepagePostCard />}
            
            <SearchCard />
            <SearchResultCard />
        </div>
    );
});

MainPage.displayName = 'MainPage';

export default MainPage;
