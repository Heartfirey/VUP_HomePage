// src/pages/RecordPage.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import config from '../config';
import { BlackRawBlurCardNoAnimate as BlurCard } from '../components/RawBlurCard';
import RecordList from '../components/LiveRecord/RecordList';
import { searchRecords, clearSearch, setSearchKeyword } from '../store/liveRecordSlice';

// 导入MUI图标
import VideocamIcon from '@mui/icons-material/Videocam';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const live2dPNG = require(`../assets/${config.siteSettings.live2dFile1}`);

const RecordPage = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const { isSearching, searchLoading } = useSelector(state => state.liveRecord);
    const dispatch = useDispatch();

    // 处理搜索
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) return;
        
        dispatch(setSearchKeyword(searchKeyword.trim()));
        dispatch(searchRecords(searchKeyword.trim()));
    };

    // 清除搜索
    const handleClearSearch = () => {
        setSearchKeyword('');
        dispatch(clearSearch());
    };

    return (
        <div className='space-y-4'>
            {/* Header card */}
            <BlurCard className="flex overflow-hidden min-h-[150px] md:min-h-[200px] max-h-[200px]">
                <div className="w-2/5 md:w-2/5 flex items-end overflow-hidden">
                    <img
                        src={live2dPNG}
                        alt="Live2D"
                        className="w-full object-contain max-h-[calc(100%-10px)] md:max-h-[calc(100%-20px)]"
                    />
                </div>

                <div className="flex-1 p-2 md:p-4 flex flex-col justify-center text-left space-y-2 md:space-y-3">
                    <div className="relative">
                        <VideocamIcon className="text-white" sx={{ fontSize: { xs: 28, md: 40 } }}/>
                    </div>
                    <p className="font-bold text-xl md:text-3xl text-white break-words leading-tight">
                        {config.anchorInfo.name}的录播日志
                    </p>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                        回顾每一次精彩的直播，记录美好的时光
                    </p>
                    
                    {/* Search bar */}
                    <form onSubmit={handleSearch} className="flex items-center space-x-2 mt-2 md:mt-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="搜索录播标题、时间点..."
                                className="w-full px-3 md:px-4 py-2 bg-white/10 border border-white/20 
                                         rounded-lg placeholder-gray-400 text-white text-sm
                                         focus:outline-none focus:border-pink-400/50 focus:bg-white/15
                                         transition-all duration-200"
                            />
                            <SearchIcon 
                                sx={{ 
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgb(156, 163, 175)',
                                    fontSize: { xs: 18, md: 20 }
                                }} 
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={!searchKeyword.trim() || searchLoading}
                            className="px-3 md:px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 
                                     border border-pink-400/30 hover:border-pink-400/50 
                                     rounded-lg transition-all duration-200 
                                     text-pink-100 hover:text-white text-sm font-medium
                                     disabled:opacity-50 disabled:cursor-not-allowed
                                     min-w-0 flex-shrink-0"
                        >
                            <span className="hidden sm:inline">
                                {searchLoading ? '搜索中...' : '搜索'}
                            </span>
                            <SearchIcon sx={{ fontSize: 16 }} className="sm:hidden" />
                        </button>
                        
                        {isSearching && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="px-3 md:px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 
                                         border border-gray-400/30 hover:border-gray-400/50 
                                         rounded-lg transition-all duration-200 
                                         text-gray-300 hover:text-white text-sm font-medium
                                         min-w-0 flex-shrink-0"
                                title="清除搜索"
                            >
                                <ClearIcon sx={{ fontSize: 16 }} />
                            </button>
                        )}
                    </form>
                </div>
            </BlurCard>

            {/* Search mode notification */}
            {isSearching && (
                <BlurCard className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <SearchIcon sx={{ color: 'rgb(156, 163, 175)', fontSize: 20 }} />
                            <span className="text-gray-300">
                                搜索结果: "{searchKeyword}"
                            </span>
                        </div>
                        <button
                            onClick={handleClearSearch}
                            className="text-pink-400 hover:text-pink-300 text-sm transition-colors"
                        >
                            查看全部录播
                        </button>
                    </div>
                </BlurCard>
            )}
            
            {/* Recording list */}
            <RecordList />
        </div>
    );
};

export default RecordPage;
