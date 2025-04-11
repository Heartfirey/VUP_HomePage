import React from 'react';
import config from '../config';
import { ReactComponent as LiveIcon } from '../assets/icon/bilibili.svg';
import { ReactComponent as IdleIcon } from '../assets/icon/unlive.svg';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';

const LiveStatusButton = ({liveStatus=0, liveTitle='', loading=1}) => {
    const bgcolorMap = {
        0: ["#9E9E9E", "#424242"],
        1: ["#FF4081", "#F50057"],
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
    return (
        <Button
            onClick={handleClick}
            sx={{ 
                borderRadius: '32px',
                px: 2.5, py: 1.2,
                color: 'white',
                bgcolor: bgcolorMap[liveStatus][0],
                '&:hover': {
                  bgcolor: bgcolorMap[liveStatus][1],
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
