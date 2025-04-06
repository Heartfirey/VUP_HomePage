import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';


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
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
                '& .MuiPaper-root': { borderRadius: '4px' }
            }}
        >
            <Alert
                severity="success"
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    pb: 1
                }}
            >
                {copiedText} 已经复制到剪切板了喵~
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#90ee90' }
                    }}
                />
            </Alert>
        </Snackbar>
    );
});

export default CopyToClipboardSnackbar;
