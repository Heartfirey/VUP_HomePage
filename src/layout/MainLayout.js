import React, { useMemo } from "react";
import config from '../config';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ClickSpark from '../animations/ClickSpark';
import Lanyard from "../animations/Lanyard";
import performanceConfig from "../utils/performanceConfig";
import BlurPerformanceMonitor from "../components/BlurPerformanceMonitor";

import SakuraBG from '../components/SakuraBG';
import Aurora from "../animations/Aoura";
import SplashCursor from "../animations/SplashCursor";
const sakuraBGPNG = require(`../assets/${config.siteSettings.backgroundFile}`);


function ScrollTop(props) {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-anchor',
        );

        if (anchor) {
            anchor.scrollIntoView({
                block: 'center',
            });
        }
    };

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {children}
            </Box>
        </Fade>
    );
}

const MainLayout = React.memo(function MainLayout({ props, children }) {
    const { roomInfo } = useSelector(state => state.bilibiliLive);

    const isOnLive = useMemo(() => {
        return roomInfo?.live_status === 1;
    }, [roomInfo?.live_status]);

    // 检测是否为低性能设备
    const isLowPerformanceDevice = useMemo(() => {
        return performanceConfig.detectDevicePerformance().isLowPerformance;
    }, []);

    return (
        <React.Fragment>
            {/* Only enable visual effects on non-low-performance devices */}
            {config.siteSettings.enableAurora && !isLowPerformanceDevice && <Aurora
                colorStops={["#FFB7C5", "#FF94B4", "#FF80AB"]}
                blend={0.6}
                amplitude={3.0}
                speed={0.5}
            />}
            {config.siteSettings.enableSakuraParticles && !isLowPerformanceDevice && <SakuraBG />} 
            {config.siteSettings.enableSplashCursor && !isLowPerformanceDevice && <SplashCursor />}
            {isOnLive && <div className="relative md:absolute top-0 md:left-1/3 w-full h-full z-9"><Lanyard /></div>}
            
            {/* Control performance monitoring display based on configuration */}
            {config.performanceMonitor?.enableBlurMonitor && <BlurPerformanceMonitor />}
            
            <ClickSpark sparkColor='#FF80AB' sparkSize={20} sparkRadius={25} sparkCount={8} duration={600}>
                <div style={{ backgroundImage: `url(${sakuraBGPNG})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover', position: 'fixed', top: 0, left: 0, zIndex: -1, objectFit: 'cover', width: '100vw', height: '100vh' }}></div>
                <NavBar />
                <Container disableGutters className="min-h-screen mx-auto overflow-y-auto w-full mt-16 pt-8 p-4 sm:px-4 md:px-6 space-y-4">
                    <div id="back-to-top-anchor" />
                    {children}
                    <Outlet />
                    <Footer />
                </Container>
                <ScrollTop {...props}>
                    <Fab size="small" aria-label="scroll back to top">
                        <KeyboardArrowUpIcon />
                    </Fab>
                </ScrollTop>
            </ClickSpark>
        </React.Fragment>
    );
});

export default MainLayout;
