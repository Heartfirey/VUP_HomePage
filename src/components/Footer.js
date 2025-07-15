import React from "react";
import config from "../config";
import BlurCard from "./BlurCard";
import { BlackRawBlurCardNoAnimate } from "./RawBlurCard";
import { Link } from "@mui/material";
import { useLocation } from 'react-router-dom';



export default function Footer() {
    const location = useLocation();
    
    // 根据当前路径判断是否使用深色主题
    const isDarkTheme = location.pathname === '/schedule' || location.pathname === '/record';
    const FooterCard = isDarkTheme ? BlackRawBlurCardNoAnimate : BlurCard;

    return (
        <div className="">
            <FooterCard className={isDarkTheme ? "p-4" : ""}>
                <p className="text-white font-bold flex justify-center">{config.anchorInfo.copyright}. All rights reserved.</p>
                <p className="text-white font-bold flex justify-center">Powered by &nbsp;<Link href="https://heartfirey.top" underline="always">HeartFireY</Link></p>
            </FooterCard>
        </div>
    );
}
