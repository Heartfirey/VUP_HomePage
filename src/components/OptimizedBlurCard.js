import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { motion, useAnimation } from 'framer-motion';
import blurOptimization, { getOptimizedBlurStyle, useBlurInstance } from '../utils/blurOptimization';

// 高性能毛玻璃卡片样式
const OptimizedGlassCard = styled(Card)(({ theme, blurPriority = 'normal' }) => {
    const optimizedStyle = getOptimizedBlurStyle(24, blurPriority);
    
    return {
        ...optimizedStyle,
        backgroundColor: optimizedStyle.backgroundColor || (
            theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
                : alpha(theme.palette.background.default, 0.4)
        ),
        border: optimizedStyle.border || '1px solid',
        borderColor: optimizedStyle.borderColor || (theme.vars || theme).palette.divider,
        boxShadow: (theme.vars || theme).shadows[1],
        borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
        // 性能优化：使用transform3d触发硬件加速
        transform: 'translate3d(0, 0, 0)',
        // 优化重绘性能
        contain: 'layout style paint',
    };
});

// 黑色主题的优化毛玻璃卡片
const OptimizedBlackGlassCard = styled(Card)(({ theme, blurPriority = 'normal' }) => {
    const optimizedStyle = getOptimizedBlurStyle(40, blurPriority);
    
    return {
        ...optimizedStyle,
        backgroundColor: optimizedStyle.backgroundColor || (
            theme.vars
                ? `rgba(0 0 0 / 0.4)` 
                : alpha(theme.palette.common.black, 0.5)
        ),
        border: optimizedStyle.border || '1px solid',
        borderColor: optimizedStyle.borderColor || (
            theme.vars 
                ? 'rgba(255 255 255 / 0.12)' 
                : alpha(theme.palette.common.white, 0.12)
        ),
        boxShadow: '0 8px 32px rgba(0 0 0 / 0.15)',
        borderRadius: 16,
        transform: 'translate3d(0, 0, 0)',
        contain: 'layout style paint',
        // 只在高性能设备上添加光泽效果
        ...(blurOptimization.blurSettings?.useWillChange && {
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
            }
        }),
    };
});

// 带动画的优化毛玻璃卡片
export default function OptimizedRawBlurCard({ children, blurPriority = 'normal', ...other }) {
    const controls = useAnimation();
    const cardRef = useRef(null);
    const [isExited, setIsExited] = useState(false);
    
    // 注册模糊实例管理
    useBlurInstance(cardRef);
    
    useEffect(() => {
        controls.start({
            y: 0,
            opacity: 1,
            transition: { duration: 0.8 }
        });
    }, [controls]);

    useEffect(() => {
        const threshold = -64;
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
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
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [controls, isExited]);

    return (
        <motion.div
            ref={cardRef}
            initial={{ y: -50, opacity: 0 }}
            animate={controls}
        >
            <OptimizedGlassCard blurPriority={blurPriority} {...other}>
                {children}
            </OptimizedGlassCard>
        </motion.div>
    );
}

// 无动画版本（性能更好）
export function OptimizedRawBlurCardNoAnimate({ children, blurPriority = 'normal', ...other }) {
    const cardRef = useRef(null);
    useBlurInstance(cardRef);
    
    return (
        <OptimizedGlassCard ref={cardRef} blurPriority={blurPriority} {...other}>
            {children}
        </OptimizedGlassCard>
    );
}

// 黑色主题无动画版本
export function OptimizedBlackRawBlurCardNoAnimate({ children, blurPriority = 'normal', ...other }) {
    const cardRef = useRef(null);
    useBlurInstance(cardRef);
    
    return (
        <OptimizedBlackGlassCard ref={cardRef} blurPriority={blurPriority} {...other}>
            {children}
        </OptimizedBlackGlassCard>
    );
}

// 轻量级替代组件（用于低性能设备）
export function LightweightCard({ children, variant = 'light', ...other }) {
    const baseStyle = {
        light: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
        dark: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }
    };
    
    return (
        <Card sx={baseStyle[variant]} {...other}>
            {children}
        </Card>
    );
}
