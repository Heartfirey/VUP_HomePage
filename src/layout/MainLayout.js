import React from "react";
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


// import SakuraBG from '../components/SakuraBG';
// import Aurora from "../animations/Aoura";
// import Particles from "../animations/Particles";
// import SplashCursor from "../animations/SplashCursor";
import sakuraBGPNG from '../assets/sakuraBackground.png';

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

export default function MainLayout({ props, children }) {
    return (
        <React.Fragment>
            {/* <Aurora
                colorStops={["#FFB7C5", "#FF94B4", "#FF80AB"]}
                blend={0.6}
                amplitude={3.0}
                speed={0.5}
            /> */}
            {/* <SakuraBG />  */}
            {/* <SplashCursor /> */}
            <div className="relative md:absolute top-0 md:left-1/3 w-full h-full z-9"><Lanyard /></div>
            <ClickSpark sparkColor='#FF80AB' sparkSize={20} sparkRadius={25} sparkCount={8} duration={600}>
                <div style={{ backgroundImage: `url(${sakuraBGPNG})`, backgroundPosition: 'center', position: 'fixed', top: 0, left: 0, zIndex: -1, objectFit: 'cover', width: '100vw', height: '100vh' }}></div>
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
    )
}
