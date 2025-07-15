// src/components/LiveRecord/RecordList.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RecordCard from './RecordCard';
import { BlackRawBlurCardNoAnimate as BlurCard } from '../RawBlurCard';
import { loadInitialWeekRecords, loadMoreWeekRecords } from '../../store/liveRecordSlice';

// 导入MUI组件
import CircularProgress from '@mui/material/CircularProgress';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

const RecordList = () => {
    const {
        records,
        searchResults,
        loading,
        initialized,
        hasMore,
        error,
        isSearching,
        currentWeekOffset
    } = useSelector(state => state.liveRecord);
    const dispatch = useDispatch();
    
    // 组件挂载时加载初始数据
    useEffect(() => {
        if (!initialized && !isSearching) {
            dispatch(loadInitialWeekRecords());
        }
    }, [dispatch, initialized, isSearching]);
    
    // 滚动加载更多（添加防抖）
    useEffect(() => {
        let isRequesting = false;
        
        const onScroll = () => {
            // 防抖：如果正在请求中，直接返回
            if (isRequesting || loading || !hasMore || !initialized || isSearching) {
                return;
            }
            
            // 检查是否到达底部
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                isRequesting = true;
                dispatch(loadMoreWeekRecords()).finally(() => {
                    // 添加小延迟避免立即重复触发
                    setTimeout(() => {
                        isRequesting = false;
                    }, 500);
                });
            }
        };

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, [dispatch, loading, hasMore, initialized, isSearching]);
    
    // 错误显示
    if (error) {
        return (
            <BlurCard className="text-center py-12">
                <div className="text-red-400 mb-4">
                    ❌ {error}
                </div>
                <button
                    onClick={() => dispatch(loadInitialWeekRecords())}
                    className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 
                             border border-pink-400/30 hover:border-pink-400/50 
                             rounded-lg transition-all duration-200 
                             text-pink-100 hover:text-white text-sm font-medium"
                >
                    重新加载
                </button>
            </BlurCard>
        );
    }
    
    // 初始加载中
    if (!initialized && loading) {
        return (
            <BlurCard className="flex flex-col items-center justify-center py-12">
                <CircularProgress sx={{ color: '#ec4899', mb: 2 }} />
                <div className="text-gray-400">正在加载录播列表...</div>
            </BlurCard>
        );
    }
    
    // 获取要显示的记录列表
    const displayRecords = isSearching ? searchResults : records;
    
    // 空状态
    if (displayRecords.length === 0 && !loading) {
        return (
            <BlurCard className="text-center py-12">
                <LocalCafeIcon sx={{ fontSize: 48, color: 'rgb(156, 163, 175)', mb: 2 }} />
                <div className="text-gray-400 mb-2">
                    {isSearching ? '未找到相关录播' : '暂无录播数据'}
                </div>
                <div className="text-gray-500 text-sm">
                    {isSearching ? '尝试调整搜索关键词' : '请稍后再试或联系管理员'}
                </div>
            </BlurCard>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* Recording card list */}
            {displayRecords.map((record) => (
                <RecordCard
                    key={record.id}
                    record={record}
                />
            ))}
            
            {/* Load more indicator */}
            {loading && (
                <div className="flex justify-center py-8">
                    <div className="flex items-center space-x-3">
                        <CircularProgress size={20} sx={{ color: '#ec4899' }} />
                        <span className="text-gray-400">
                            {isSearching ? '搜索中...' : '加载更多录播...'}
                        </span>
                    </div>
                </div>
            )}
            

            

        </div>
    );
};

export default RecordList;
