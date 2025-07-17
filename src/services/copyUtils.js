import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Snackbar, Box, Typography, Fade, Slide } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            console.debug('复制成功');
        } catch (err) {
            console.error('复制失败:', err);
        }
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                console.debug('复制成功');
            } else {
                console.error('复制失败');
            }
        } catch (err) {
            console.error('复制失败:', err);
        }
        document.body.removeChild(textarea);
    }
}

const CopyToClipboardSnackbar = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [copiedText, setCopiedText] = useState('');
    const [progress, setProgress] = useState(100);
    const duration = 3000;

    const handleCopy = (text) => {
        copyToClipboard(text).then(() => {
            setCopiedText(text);
            setOpen(true);
            setProgress(100);
        });
    };

    useImperativeHandle(ref, () => ({
        copy: handleCopy,
    }));

    useEffect(() => {
        if (open) {
            const startTime = Date.now();
            const timer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const newProgress = Math.max(100 - (elapsed / duration) * 100, 0);
                setProgress(newProgress);
                if (elapsed >= duration) {
                    setOpen(false);
                    clearInterval(timer);
                }
            }, 100);
            return () => clearInterval(timer);
        }
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        duration: 0.4
                    }}
                    style={{
                        position: 'fixed',
                        top: '24px',
                        right: '24px',
                        zIndex: 1400
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95), rgba(21, 101, 192, 0.95))',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            overflow: 'hidden',
                            minWidth: '280px',
                            maxWidth: '400px'
                        }}
                    >
                        {/* 主要内容 */}
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            {/* 图标动画 */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 25,
                                    delay: 0.2
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '8px',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    <CheckCircleIcon 
                                        sx={{ 
                                            fontSize: 20, 
                                            color: '#ffffff'
                                        }} 
                                    />
                                </Box>
                            </motion.div>

                            {/* 文字内容 */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography 
                                    variant="subtitle2" 
                                    sx={{ 
                                        color: '#ffffff',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        mb: 0.5
                                    }}
                                >
                                    复制成功！
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '0.75rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {copiedText}
                                </Typography>
                            </Box>

                            {/* 复制图标 */}
                            <Box
                                sx={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: '6px',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}
                            >
                                <ContentCopyIcon 
                                    sx={{ 
                                        fontSize: 14, 
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }} 
                                />
                            </Box>
                        </Box>

                        {/* 进度条 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: '3px',
                                background: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '0 0 16px 16px',
                                overflow: 'hidden'
                            }}
                        >
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: duration / 1000, ease: "linear" }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))',
                                    borderRadius: '0 0 16px 16px'
                                }}
                            />
                        </Box>

                        {/* 装饰性光效 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)'
                            }}
                        />
                    </Box>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default CopyToClipboardSnackbar;
