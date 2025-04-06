import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { motion, useAnimation } from 'framer-motion';


const GlassCard = styled(Card)(({ theme }) => ({
    backdropFilter: 'blur(24px)',
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    boxShadow: (theme.vars || theme).shadows[1],
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    //   padding: theme.spacing(2),
}));

export default function RawBlurCard({ children, ...other }) {
    const controls = useAnimation();
    const cardRef = useRef(null);
    const [isExited, setIsExited] = useState(false);
    useEffect(() => {
        controls.start({
            y: 0,
            opacity: 1,
            transition: { duration: 0.8 }
        });
    }, [controls]);
    useEffect(() => {
        const threshold = -64;
        const handleScroll = () => {
            if (cardRef.current) {
                const rect = cardRef.current.getBoundingClientRect();
                if (rect.top <= threshold && !isExited) {
                    controls.start({
                        x: 300,
                        opacity: 0,
                        transition: { duration: 0.5 }
                    });
                    setIsExited(true);
                }
                else if (rect.top > threshold && isExited) {
                    controls.start({
                        x: 0,
                        opacity: 1,
                        transition: { duration: 0.5 }
                    });
                    setIsExited(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [controls, isExited]);
    return (
        <motion.div
            ref={cardRef}
            initial={{ y: -50, opacity: 0 }}
            animate={controls}
        >
            <GlassCard {...other}>
                {children}
            </GlassCard>
        </motion.div>
    );
}
