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

const BlackGlassCard = styled(Card)(({ theme }) => ({
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)', 
    backgroundColor: theme.vars
        ? `rgba(0 0 0 / 0.4)` 
        : alpha(theme.palette.common.black, 0.5),
    border: '1px solid',
    borderColor: theme.vars 
        ? 'rgba(255 255 255 / 0.12)' 
        : alpha(theme.palette.common.white, 0.12),
    boxShadow: '0 8px 32px rgba(0 0 0 / 0.15)', 
    borderRadius: 16, // iOS 常用圆角值
    // 添加渐变光泽效果（可选）
    '&:before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 16,
        background: `linear-gradient(
            145deg,
            rgba(255 255 255 / 0.05) 0%,
            rgba(255 255 255 / 0.01) 100%
        )`,
        pointerEvents: 'none',
    },
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

export function RawBlurCardNoAnimate({ children, ...other }) {
    return (
        <GlassCard {...other}>
            {children}
        </GlassCard>
    );
}

export function BlackRawBlurCardNoAnimate({ children, ...other }) {
    return (
        <BlackGlassCard {...other}>
            {children}
        </BlackGlassCard>
    );
}
