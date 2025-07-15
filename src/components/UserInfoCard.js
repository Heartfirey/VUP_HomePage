import React, { useState } from 'react';
import config from '../config';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import { AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { RawBlurCardNoAnimate as RawBlurCard } from '../components/RawBlurCard';
import BiliUserGrid, { Top3UserGrid } from './BiliUserCard';
import FanBadge from './FanBandge';
import InteractiveEchartsBar from './InteractiveCharts';
import { CardContent } from '@mui/material';
import { useGetFansHistoryQuery, useGetUserInfoQuery, useGetLiveGuardsHistoryQuery, useGetLiveFansMemberQuery, useGetUpowerQuery, useGetLiveGuardsQuery } from '../services/API/third-party/vrp.moe';
import Skeleton from '@mui/material/Skeleton';
import SvgIcon from '@mui/material/SvgIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyleTwoToneIcon from '@mui/icons-material/StyleTwoTone';
import PollTwoToneIcon from '@mui/icons-material/PollTwoTone';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import ChargingStationTwoToneIcon from '@mui/icons-material/ChargingStationTwoTone';
import DirectionsBoatTwoToneIcon from '@mui/icons-material/DirectionsBoatTwoTone';

import { ReactComponent as MaleIcon } from '../assets/icon/male.svg';
import { ReactComponent as FemaleIcon } from '../assets/icon/female.svg';
import { ReactComponent as SecretIcon } from '../assets/icon/baomi.svg';

const genderIconMap = {
    "保密": SecretIcon,
    "女性": FemaleIcon,
    "男性": MaleIcon
}

const genderColorMap = {
    "保密": "#FF6D00",
    "女性": "#FF4081",
    "男性": "#2196F3"
}

const colorTop3GuardMap = {
    1: "#FFAB00",
    2: "#90A4AE",
    3: "#FF7043",
}

const InfoAccordion = styled(Accordion)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '36px',
    boxShadow: 'none',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0, 1),
    '&:before': {
        display: 'none',
    },
    '& .MuiAccordionSummary-root': {
        padding: theme.spacing(0, 1),
    },
    '&:first-of-type': {
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
    },
    '&:last-of-type': {
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
    },
}));

const LazyInfoAccordion = ({ children, ...props }) => {
    const [expanded, setExpanded] = useState(false);

    const summary = Array.isArray(children) ? children[0] : children;
    const details = Array.isArray(children) ? children[1] : null;

    const handleChange = (event, isExpanded) => {
        setExpanded(isExpanded);
    };

    return (
        <InfoAccordion expanded={expanded} onChange={handleChange} {...props}>
            {summary}
            {expanded && details}
        </InfoAccordion>
    );
};


const NumericString = ({ value }) => {
    const num = Number(value);
    let colorClass = 'text-gray-500 font-bold';
    if (num > 0) {
        colorClass = 'text-green-700 font-bold';
    } else if (num < 0) {
        colorClass = 'text-red-700 font-bold';
    }

    return <span className={colorClass}>{num}</span>;
};

const parseUserInfoData = (data) => {
    return {
        name: data.data.card.name,
        mid: data.data.card.mid,
        face: data.data.card.face,
        avatarFrame: data.data.card.pendant.image,
        sign: data.data.card.sign,
        sex: data.data.card.sex,
        friend: data.data.card.friend,
        followers: data.data.follower,
    }
}

function mapUpowerData(data) {
    return data.map((item) => ({
        id: item.mid,
        avatarUrl: item.avatar,
        username: item.nickname,
        extraComponent: null,
        extraInfo: item.day + "天",
    }));
}

function mapGuardData(data) {
    return data.map((item) => ({
        id: item.uid,
        avatarUrl: item.face,
        username: item.username,
        extraComponent: <FanBadge name={item.medal_info.medal_name} level={item.medal_info.medal_level} />,
        extraInfo: "陪伴" + item.accompany + "天",
    }));
}

function mapTop3GuardData(data) {
    return data.map((item, index) => ({
        id: item.uid,
        avatarUrl: item.face,
        username: item.username,
        extraComponent: <FanBadge name={item.medal_info.medal_name} level={item.medal_info.medal_level} />,
        extraInfo: "陪伴" + item.accompany + "天",
        badgeColor: colorTop3GuardMap[index + 1],
        badgeIcon: MilitaryTechRoundedIcon,
    }));
}

function calculateFanChanges(data) {
    const fansMap = {};
    data.forEach(item => {
        fansMap[item.date] = item.fans;
    });

    const formatDate = dateObj => dateObj.toISOString().split('T')[0];

    return data.map(item => {
        const currDate = new Date(item.date);

        const getPriorDateString = (days) => {
            const d = new Date(currDate);
            d.setDate(d.getDate() - days);
            return formatDate(d);
        };

        const prior1Date = getPriorDateString(1);
        const prior7Date = getPriorDateString(7);
        const prior30Date = getPriorDateString(30);

        const fanChange1 = fansMap[prior1Date] !== undefined ? item.fans - fansMap[prior1Date] : null;
        const fanChange7 = fansMap[prior7Date] !== undefined ? item.fans - fansMap[prior7Date] : null;
        const fanChange30 = fansMap[prior30Date] !== undefined ? item.fans - fansMap[prior30Date] : null;

        return {
            ...item,
            fanChange1,
            fanChange7,
            fanChange30,
        };
    });
}

function calculateGuardChanges(data) {
    if (data.code == 500) {
        return {
            currentGuardTotal: 0,
            guardChange1Day: 0,
            guardChange7Day: 0,
            guardChange30Day: 0,
            careerAverageGuard: 0,
        }; 
    }
    if (!data.length) {
        return {
            currentGuardTotal: 0,
            guardChange1Day: 0,
            guardChange7Day: 0,
            guardChange30Day: 0,
            careerAverageGuard: 0,
        };
    }

    const currentItem = data[data.length - 1];
    const currentTime = currentItem.time;
    const currentGuardTotal = currentItem.guardNum;

    const dayMs = 24 * 60 * 60 * 1000;

    const targetTimes = {
        change1Day: currentTime - 1 * dayMs,
        change7Day: currentTime - 7 * dayMs,
        change30Day: currentTime - 30 * dayMs,
    };

    function findRecordBefore(targetTime) {
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].time <= targetTime) {
                return data[i];
            }
        }
        return null;
    }

    const record1Day = findRecordBefore(targetTimes.change1Day);
    const record7Day = findRecordBefore(targetTimes.change7Day);
    const record30Day = findRecordBefore(targetTimes.change30Day);

    const change1Day = record1Day ? currentGuardTotal - record1Day.guardNum : null;
    const change7Day = record7Day ? currentGuardTotal - record7Day.guardNum : null;
    const change30Day = record30Day ? currentGuardTotal - record30Day.guardNum : null;

    const totalGuard = data.reduce((acc, item) => acc + item.guardNum, 0);
    const careerAverageGuard = Math.round(totalGuard / data.length);

    return {
        currentGuardTotal: currentGuardTotal,
        guardChange1Day: change1Day,
        guardChange7Day: change7Day,
        guardChange30Day: change30Day,
        careerAverageGuard: careerAverageGuard,
    };
}

export default function UserInfoCard() {

    const {
        data: userInfo,
        isLoading: userInfoLoading,
        error: userInfoError,
    } = useGetUserInfoQuery(config.anchorInfo.uid, { pollingInterval: 60000 });

    const {
        data: fansHistory,
        isLoading: fansHistoryLoading,
        error: fansHistoryError,
    } = useGetFansHistoryQuery(config.anchorInfo.uid, { pollingInterval: 60000 * 60 * 24 });

    const {
        data: liveGuardsHistory,
        isLoading: liveGuardsLoading,
        error: liveGuardsError,
    } = useGetLiveGuardsHistoryQuery(config.anchorInfo.uid, { pollingInterval: 60000 * 60 * 24 });

    const {
        data: liveFansNumber,
        isLoading: liveFansNumberLoading,
        error: liveFansNumberError,
    } = useGetLiveFansMemberQuery(config.anchorInfo.uid, { pollingInterval: 60000 * 60 * 24 });

    const {
        data: upower,
        isLoading: upowerLoading,
        error: upowerError,
    } = useGetUpowerQuery(config.anchorInfo.uid, { pollingInterval: 60000 * 60 * 24 });

    const {
        data: liveGuards,
        isLoading: liveGuardsLstLoading,
        error: liveGuardsLstError,
    } = useGetLiveGuardsQuery(config.anchorInfo.uid, { pollingInterval: 60000 * 60 * 24 });

    const combinedLoading = userInfoLoading || fansHistoryLoading || liveGuardsLoading || liveGuardsLstLoading || liveFansNumberLoading || upowerLoading;
    const combinedError = userInfoError || fansHistoryError || liveGuardsError || liveGuardsLstError || liveFansNumberError || upowerError;




    if (combinedLoading || combinedError) {
        return (
            <RawBlurCard>
                <CardContent className="flex justify-center">
                    <div
                        className="flex flex-col md:flex-row items-center md:items-start p-[25px] md:space-x-4 mx-auto [--frame-scale-factor:1.7] [--avatar-size:100px]"
                    >
                        <div className="relative w-[var(--avatar-size)] h-[var(--avatar-size)] mx-auto md:mx-4">
                            <Skeleton variant="circular" width={100} height={100} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="mt-8 md:mt-0 md:ml-8 text-center md:text-left space-y-1">
                            <Skeleton animation="wave" />
                            <div className="flex items-center justify-center md:justify-start">
                                <Skeleton animation="wave" width={320} />
                            </div>
                            <div>
                                <Skeleton animation="wave" width={320} />
                            </div>
                            <div>
                                <Skeleton animation="wave" width={320} />
                            </div>
                            <div>
                            <p className='text-center text-xl font-bold text-gray-200'>如果长时间未响应，请刷新页面</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </RawBlurCard>
        )
    }

    const { currentGuardTotal, guardChange1Day, guardChange7Day, guardChange30Day, careerAverageGuard } = calculateGuardChanges(liveGuardsHistory);

    const fansName = config.anchorInfo.fanTag;
    const liveFansNumberNum = liveFansNumber.data.num;
    const upowerTotalNum = upower.data.member_total;
    const upowerUserList = upower.data.rank_info;
    const guardUserList = liveGuards.data.list;
    const top3GuardUserList = liveGuards.data.top3;

    const parsedData = parseUserInfoData(userInfo);
    const avatarURL = parsedData.face;
    const avatarFrameURL = parsedData.avatarFrame;

    return (
        <RawBlurCard>
            <CardContent>
                <div
                    className="flex flex-col md:flex-row items-center md:items-start p-[25px] md:space-x-4 mx-auto [--frame-scale-factor:1.7] [--avatar-size:100px]"
                >
                    <div className="relative w-[var(--avatar-size)] h-[var(--avatar-size)] mx-auto md:mx-4">
                        <img
                            src={avatarURL}
                            alt="用户头像"
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-full object-cover"
                        />
                        {avatarFrameURL && <img
                            referrerPolicy="no-referrer"
                            src={avatarFrameURL}
                            alt="头像框"
                            className="absolute top-0 left-0 w-full h-full"
                            style={{
                                transform: 'scale(var(--frame-scale-factor))',
                                transformOrigin: 'center',
                            }}
                        />}
                    </div>
                    <div className="mt-8 md:mt-0 md:ml-8 text-center md:text-left space-y-1">
                        <h2 className="text-xl font-bold">{parsedData.name}</h2>
                        <div className="flex items-center justify-center md:justify-start">
                            <div
                                className="flex items-center justify-center w-4 h-4 rounded-full"
                                style={{ backgroundColor: genderColorMap[parsedData.sex] }}
                            >
                                <SvgIcon
                                    inheritViewBox
                                    component={genderIconMap[parsedData.sex]}
                                    fontSize="small"
                                    sx={{
                                        fontSize: '10px',
                                        width: '10px',
                                        height: '10px',
                                        color: 'white'
                                    }}
                                />
                            </div>
                            <p className="text-sm ml-1 font-bold" style={{ color: genderColorMap[parsedData.sex] }}>{parsedData.mid}</p>
                        </div>
                        <div>
                            <p className="text-sm">{parsedData.friend}&nbsp;关注，{parsedData.followers}&nbsp;粉丝</p>
                        </div>
                        <div>
                            <p className="text-xs md:text-sm">{parsedData.sign}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 mx-2">
                    <InfoAccordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="flex items-center">
                            <PollTwoToneIcon className="flex-col" />
                            <Typography component="span" className="flex-col px-2">涨跌粉</Typography>
                            数据源缺失中
                        </AccordionSummary>
                        <AccordionDetails>
                            数据源缺失中
                        </AccordionDetails>
                    </InfoAccordion>
                </div>

                <div className="mt-2 mx-2">
                    <LazyInfoAccordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="flex items-center">
                            <StyleTwoToneIcon className="flex-col" />
                            <Typography component="span" className="flex-col px-2">粉丝牌</Typography>
                            <FanBadge name={fansName} level={28} />
                        </AccordionSummary>
                        <AccordionDetails>
                            欢迎关注我，成为我的粉丝团成员！
                        </AccordionDetails>
                    </LazyInfoAccordion>
                </div>

                <div className="mt-2 mx-2">
                    <LazyInfoAccordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="flex items-center">
                            <ChargingStationTwoToneIcon className="flex-col" />
                            <Typography component="span" className="flex-col px-2">充电榜</Typography>
                            <Typography component="span" className="flex-col px-2">
                                <span className='font-bold'>{upowerTotalNum}</span> 人
                            </Typography>

                        </AccordionSummary>
                        <AccordionDetails>
                            <BiliUserGrid
                                users={mapUpowerData(upowerUserList)}
                                pageSize={10}
                                maxHeight={600}
                            />
                        </AccordionDetails>
                    </LazyInfoAccordion>
                </div>

                <div className="mt-2 mx-2">
                    <LazyInfoAccordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} className="flex items-center">
                            <DirectionsBoatTwoToneIcon className="" />
                            <Typography component="span" className="px-2">大航海</Typography>
                            <Typography className="items-center px-2 max-w-[200px] md:max-w-[1000px]">
                                在舰&nbsp;<NumericString value={currentGuardTotal} />&nbsp;
                                日&nbsp;<NumericString value={guardChange1Day} />&nbsp;
                                周&nbsp;<NumericString value={guardChange7Day} />&nbsp;
                                月&nbsp;<NumericString value={guardChange30Day} />&nbsp;
                                生涯平均&nbsp;<span className='font-bold'>{careerAverageGuard}</span>&nbsp;
                                粉丝团&nbsp;<span className='font-bold'>{liveFansNumberNum}</span>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            { liveGuardsHistory.code != 500 && <InteractiveEchartsBar infoList={liveGuardsHistory} barName="舰长数"/> }
                            <Top3UserGrid
                                users={mapTop3GuardData(top3GuardUserList)}
                            />
                            <BiliUserGrid
                                users={mapGuardData(guardUserList)}
                                pageSize={10}
                                maxHeight={600}
                            />
                        </AccordionDetails>
                    </LazyInfoAccordion>
                </div>
            </CardContent>
        </RawBlurCard>
    )
}
