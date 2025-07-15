// src/components/ScheduleTable.js
import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import WeekRow from './WeekRow';
import dayjs from 'dayjs';
import { BlackRawBlurCardNoAnimate, BlackRawBlurCardNoAnimate as RawBlurCard } from '../RawBlurCard';
import { loadMoreSchedules, loadInitialSchedules } from '../../store/scheduleSlice';



const ScheduleTable = () => {
    const weekList = useSelector(state => state.schedule.weekList);
    const loading = useSelector(state => state.schedule.loading);
    const initialized = useSelector(state => state.schedule.initialized);
    const hasMore = useSelector(state => state.schedule.hasMore);
    const error = useSelector(state => state.schedule.error);
    const dispatch = useDispatch();

    // 组件挂载时加载初始数据
    useEffect(() => {
        if (!initialized) {
            dispatch(loadInitialSchedules());
        }
    }, [dispatch, initialized]);

    useEffect(() => {
        const onScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && 
                !loading && hasMore && initialized) {
                dispatch(loadMoreSchedules());
            }
        };

        window.addEventListener('scroll', onScroll);
        // 清理事件监听
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [dispatch, loading, hasMore, initialized]);

    const today = dayjs().toDate();

    return (
        <BlackRawBlurCardNoAnimate>
            <div className="p-4">
                {/* 显示错误信息 */}
                {error && (
                    <div className="text-red-400 text-center mb-4 p-2 bg-red-900/20 rounded">
                        加载失败: {error}
                    </div>
                )}
                
                {/* 初始加载状态 */}
                {loading && !initialized && (
                    <Box display="flex" justifyContent="center" mt={4} mb={4}>
                        <CircularProgress size={40} sx={{ color: 'white' }} />
                        <span className="ml-2 text-white">正在加载直播计划...</span>
                    </Box>
                )}
                
                {/* 显示周数据 */}
                {weekList.map((weekData, idx) => (
                    <WeekRow key={`${weekData.year}-${weekData.week}`} weekData={weekData} todayDate={today} />
                ))}
                
                {/* 加载更多状态 */}
                {loading && initialized && (
                    <Box display="flex" justifyContent="center" mt={2} mb={2}>
                        <CircularProgress size={32} sx={{ color: 'white' }} />
                        <span className="ml-2 text-white">加载更多...</span>
                    </Box>
                )}
                
                {/* 没有更多数据提示 */}
                {!hasMore && initialized && weekList.length > 0 && (
                    <div className="flex items-center justify-center mt-4 mb-2 py-3 px-4 mx-auto max-w-sm
                                  rounded-lg bg-gradient-to-r from-gray-600/10 to-gray-700/10 
                                  backdrop-blur-sm border border-white/10">
                        <LocalCafeIcon 
                            sx={{ 
                                width: 16, 
                                height: 16, 
                                color: 'rgb(156, 163, 175)',
                                mr: 1.5
                            }} 
                        />
                        <span className="text-sm text-gray-300 font-medium">已展示全部内容</span>
                    </div>
                )}
                
                {/* 没有数据提示 */}
                {initialized && weekList.length === 0 && !loading && (
                    <div className="flex items-center justify-center mt-6 mb-4 py-4 px-6 mx-auto max-w-md
                                  rounded-lg bg-gradient-to-r from-blue-500/15 to-purple-500/15 
                                  backdrop-blur-sm border border-white/10">
                        <span className="text-lg mr-3">📅</span>
                        <div className="text-center">
                            <div className="text-sm font-medium text-gray-300">暂无直播计划</div>
                            <div className="text-xs text-gray-500">请稍后再试</div>
                        </div>
                    </div>
                )}
            </div>
        </BlackRawBlurCardNoAnimate>
    );
};

export default ScheduleTable;

