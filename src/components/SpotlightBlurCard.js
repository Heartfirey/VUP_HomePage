import * as React from 'react';
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from "react";
import { styled, alpha } from '@mui/material/styles';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import Card from '@mui/material/Card';

const GlassCard = styled(Card)(({ theme }) => ({
    backdropFilter: 'blur(24px)',
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    boxShadow: (theme.vars || theme).shadows[1],
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
}));

export default function SpotlightBlurCard({ children, className, spotlightColor = "rgba(255, 183, 197, 0.65)", ...other }) {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
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
        const threshold = 36;

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

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(0.6);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(0.6);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };
    return (
        <motion.div
            ref={cardRef}
            initial={{ y: -50, opacity: 0 }}
            animate={controls}
        >
            <GlassCard
                ref={divRef}
                onMouseMove={handleMouseMove}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={` ${className}`}
                {...other}>
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
                    style={{
                        opacity,
                        background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
                    }}
                />
                {children}
            </GlassCard>
        </motion.div>
    );
}

export function CardSwitcher({ children }) {
    const activeCard = useSelector(state => state.cardSwitcher.activeCard);

    const variants = {
        initial0: { x: 0, opacity: 1 },
        exit0: { x: -300, opacity: 0, transition: { duration: 0.5 } },
        initial1: { x: 300, opacity: 0 },
        animate1: { x: 0, opacity: 1, transition: { duration: 0.5 } },
        exit1: { x: 300, opacity: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="relative min-h-[250px] md:min-h-[300px]">
            <AnimatePresence initial={false}>
                {activeCard === 0 && (
                    <motion.div
                        key="card0"
                        initial="initial0"
                        animate="initial0"
                        exit="exit0"
                        variants={variants}
                        className="absolute inset-0"
                    >
                        {children[0]}
                    </motion.div>
                )}
                {activeCard === 1 && (
                    <motion.div
                        key="card1"
                        initial="initial1"
                        animate="animate1"
                        exit="exit1"
                        variants={variants}
                        className="absolute inset-0"
                    >
                        {children[1]}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
