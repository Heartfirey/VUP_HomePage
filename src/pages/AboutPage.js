import React from 'react';
import RawBlurCard from '../components/RawBlurCard';
import FuzzyText from '../animations/FuzzyText';
import { CardContent, useTheme, useMediaQuery } from '@mui/material';

const AboutPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <div >
            <RawBlurCard sx={{ display: 'flex', overflow: 'hidden', maxHeight: '300px', minHeight: '100px' }} className="justify-center">
                <CardContent className="flex justify-center">
                    <div className="justify-center">
                        <FuzzyText
                            fontSize={isMobile ? '4rem' : '10rem'}
                            baseIntensity={0.2}
                            hoverIntensity={0.2}
                            enableHover={true}
                        >
                            Not Ready Yet...
                        </FuzzyText>

                        <FuzzyText
                            fontSize={isMobile ? '2rem' : '6rem'}
                            baseIntensity={0.2}
                            hoverIntensity={0.2}
                            enableHover={true}
                        >
                            Please keep on waiting...
                        </FuzzyText>
                    </div>
                </CardContent>
            </RawBlurCard>
        </div>
    );
};

export default AboutPage;
