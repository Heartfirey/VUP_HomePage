import React from "react";
import config from "../config";
import BlurCard from "./BlurCard";
import { Link } from "@mui/material";
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
// import { Link } from "@mui/material";


export default function GraduateCard() {
    return (
        <div className="space-y-4">
            <BlurCard>
                <div className="flex items-center justify-center"><SchoolRoundedIcon className="text-black text-3xl mr-3" /><p className="text-black text-3xl font-bold flex justify-center">毕业通知</p></div>
                <p className="text-black font flex justify-left mx-8">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大家好，我是来自雪域Provealms所属魔导学院控偶师阿音Ayln，直播活动结束日期为本月底（5月），希望接下来的日子我们好好珍惜彼此，谢谢大家陪我这么久，希望伟大的猪猪音天天开心身体健康，离别不是再见，是为了更好的相逢，也许有一天会以新的形式再次相遇，人生有梦，各自精彩！<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账号不会注销，投稿也不会删除，舰长群也会保留，很抱歉，谢谢大家。（大家记得取消舰长自动续费）
                </p>
            </BlurCard>
            <BlurCard>
            <div className="flex items-center justify-center"><LanguageRoundedIcon className="text-black text-xl mr-3" /><p className="text-black text-xl font-bold flex justify-center">站点服务终止公告</p></div>
                <p className="text-black font flex justify-center mx-8">
                    由于不可抗力因素，本站点拟于2025年5月31日正式停止功能性服务，并转为静态网站，届时将不再提供歌单服务。
                </p>
                <p className="text-black font flex justify-center mx-8">
                    感谢您对阿音Ayln及本站点的支持，祝您身体健康，工作顺利，期待与您于此再会！
                </p>
                <p className="text-black font-bold flex justify-center mx-8">
                    <Link href="https://rins.top">那么，在哪里再会呢？</Link>
                </p>
            </BlurCard>
        </div>
    );
}
