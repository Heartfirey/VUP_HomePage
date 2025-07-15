import React from 'react';
import config from '../config';
import { ReactComponent as LiveIcon } from '../assets/icon/bilibili.svg';
import { ReactComponent as IdleIcon } from '../assets/icon/unlive.svg';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';

const LiveStatusButton = ({liveStatus=0, liveTitle='', loading=1}) => {
    const bgcolorMap = {
        0: ["#9E9E9E", "#757575"],
        1: ["#FF4081", "#E91E63"],
        2: ["#E040FB", "#D500F9"],
    }

    const statusMap = {
        0: "尚未开播",
        1: `正在直播:${liveTitle}`,
        2: "轮播中...",
    }
    

    const handleClick = () => {
        if (liveStatus !== 0) {
            window.open(`https://live.bilibili.com/${config.anchorInfo.roomId}`, '_blank');
        }
    };

    // Get the color for current status
    const currentBgColor = bgcolorMap[liveStatus][0];
    const currentHoverColor = bgcolorMap[liveStatus][1];

    return (
        <Button
            onClick={handleClick}
            sx={{ 
                borderRadius: '8px',
                px: 2.5, py: 1.2,
                fontWeight: 600,
                fontSize: '0.875rem',
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                background: currentBgColor,
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: liveStatus !== 0 ? 
                    `0 4px 16px ${currentBgColor}40` : 
                    '0 4px 16px rgba(158, 158, 158, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: '120px',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: 'left 0.5s ease',
                },
                '&:hover': {
                    background: currentHoverColor,
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: liveStatus !== 0 ? 
                        `0 6px 24px ${currentBgColor}60` : 
                        '0 6px 24px rgba(158, 158, 158, 0.4)',
                    transform: liveStatus !== 0 ? 'translateY(-2px) scale(1.02)' : 'none',
                    '&:before': {
                        left: '100%',
                    }
                },
                '&:active': {
                    transform: liveStatus !== 0 ? 'translateY(0) scale(0.98)' : 'none',
                    transition: 'all 0.1s ease',
                },
                '&.Mui-disabled': {
                    background: '#9E9E9E',
                    color: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: 'none',
                    transform: 'none',
                    '&:before': {
                        display: 'none',
                    }
                },
            }}
            variant="contained"
            disabled={liveStatus === 0}
            startIcon={<SvgIcon component={liveStatus !== 0 ? LiveIcon : IdleIcon} inheritViewBox fontSize="small" />}
        >
            {loading ? '加载中...' : statusMap[liveStatus]}
        </Button>
    );
};

export default LiveStatusButton;
