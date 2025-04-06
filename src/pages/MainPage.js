// MainPage.jsx
import React from 'react';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { fetchSongNum } from '../store/songNumSlice';
// import RawBlurCard from '../components/RawBlurCard';
import SpotlightBlurCard from '../components/SpotlightBlurCard';
import SearchCard from '../components/SearchCard';
import SearchResultCard from '../components/SearchResultCard';
import VariableProximity from '../animations/VariableProximity';
// import ShinyText from '../animations/ShinyText';
import CountUp from '../animations/CountUp';
import live2dPNG from '../assets/l2d_up.png';

const MainPage = () => {
    const containerRef = useRef(null);
    const dispatch = useDispatch();
    const { songNum, status } = useSelector((state) => state.songNum);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchSongNum());
        }
    }, [status, dispatch]);

    return (
        <div className="space-y-4" >
            <SpotlightBlurCard sx={{ display: 'flex', overflow: 'hidden', maxHeight: '300px' }}>
                <Box
                    sx={{
                        position: 'relative',
                        width: { xs: '40%', sm: '35%' },
                        display: 'flex',
                        alignItems: 'flex-end',
                        overflow: 'hidden',
                    }}
                >
                    <img
                        src={live2dPNG}
                        alt="Live2D"
                        style={{
                            width: '100%',
                            objectFit: 'contain',
                            maxHeight: 'calc(100% - 20px)',
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'left',
                    }}

                >
                    <div ref={containerRef} style={{ position: 'relative' }}>
                        <VariableProximity
                            label={'阿音Ayln的直播间'}
                            className={'variable-proximity-demo text-3xl font-bold md:text-5xl'}
                            fromFontVariationSettings="'wght' 400, 'opsz' 9"
                            toFontVariationSettings="'wght' 1000, 'opsz' 40"
                            containerRef={containerRef}
                            radius={100}
                            falloff='gaussian'
                        />
                    </div>

                    <p className='text-2xl md:text-3xl'>和她拿手的<CountUp from={0} to={songNum} separator="," direction="up" duration={1} className="count-up-text" />首歌</p>
                </Box>
            </SpotlightBlurCard>
            <SearchCard />
            <SearchResultCard />
        </div>
    );
};

export default MainPage;
