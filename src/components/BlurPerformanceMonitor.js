// 模糊效果性能监控组件
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Chip, Collapse, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import blurOptimization from '../utils/blurOptimization';
import performanceMonitor from '../utils/performanceMonitor';
import config from '../config';

const BlurPerformanceMonitor = () => {
    const [expanded, setExpanded] = useState(config.performanceMonitor?.autoExpand || false);
    const [performanceData, setPerformanceData] = useState(null);
    const [blurInstances, setBlurInstances] = useState(0);
    
    useEffect(() => {
        // 获取性能数据
        const deviceCapability = blurOptimization.deviceCapability;
        const blurSettings = blurOptimization.blurSettings;
        const advice = blurOptimization.getPerformanceAdvice();
        
        setPerformanceData({
            deviceCapability,
            blurSettings,
            advice
        });
        
        // 使用性能监控管理器监控模糊实例
        const cleanup = performanceMonitor.observeBlurInstances((instances) => {
            setBlurInstances(instances);
        });
        
        // 定期更新性能数据
        const updateInterval = performanceMonitor.getConfig('updateInterval') || 500;
        const intervalId = setInterval(() => {
            const stats = performanceMonitor.getPerformanceStats();
            setBlurInstances(stats.blurInstances);
        }, updateInterval);
        
        return () => {
            cleanup();
            clearInterval(intervalId);
        };
    }, []);
    
    // 检查是否应该显示监控面板
    if (!performanceMonitor.isFeatureEnabled('blurMonitor') || !performanceMonitor.isFeatureEnabled('performancePanel')) {
        return null;
    }
    
    if (!performanceData) return null;
    
    const { deviceCapability, blurSettings, advice } = performanceData;
    
    const getStatusColor = () => {
        if (!blurSettings.enableBlur) return 'error';
        if (deviceCapability.gpuTier === 'low') return 'warning';
        return 'success';
    };
    
    // 获取监控面板位置样式
    const getPositionStyle = () => {
        const position = performanceMonitor.getConfig('monitorPosition') || 'top-right';
        const baseStyle = {
            position: 'fixed',
            zIndex: 9999,
            width: expanded ? 350 : 200,
            transition: 'width 0.3s ease'
        };
        
        switch (position) {
            case 'top-left':
                return { ...baseStyle, top: 10, left: 10 };
            case 'top-right':
                return { ...baseStyle, top: 10, right: 10 };
            case 'bottom-left':
                return { ...baseStyle, bottom: 10, left: 10 };
            case 'bottom-right':
                return { ...baseStyle, bottom: 10, right: 10 };
            default:
                return { ...baseStyle, top: 10, right: 10 };
        }
    };
    
    return (
        <Paper
            sx={{
                ...getPositionStyle(),
                p: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                fontSize: '0.75rem'
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" fontWeight="bold">
                    模糊效果监控
                </Typography>
                <IconButton
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    sx={{ color: 'white', p: 0.5 }}
                >
                    <ExpandMoreIcon 
                        sx={{ 
                            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }} 
                    />
                </IconButton>
            </Box>
            
            <Box display="flex" gap={0.5} mt={0.5}>
                <Chip
                    label={`GPU: ${deviceCapability.gpuTier}`}
                    size="small"
                    color={getStatusColor()}
                    sx={{ fontSize: '0.6rem', height: 20 }}
                />
                <Chip
                    label={`实例: ${blurInstances}/${blurSettings.maxBlurInstances}`}
                    size="small"
                    color={blurInstances > blurSettings.maxBlurInstances ? 'error' : 'default'}
                    sx={{ fontSize: '0.6rem', height: 20 }}
                />
            </Box>
            
            <Collapse in={expanded}>
                <Box mt={1}>
                    <Typography variant="caption" display="block" gutterBottom>
                        <strong>设备信息:</strong>
                    </Typography>
                    <Box ml={1} mb={1}>
                        <Typography variant="caption" display="block">
                            • 移动设备: {deviceCapability.isMobile ? '是' : '否'}
                        </Typography>
                        <Typography variant="caption" display="block">
                            • 低性能模式: {deviceCapability.isLowPerformance ? '是' : '否'}
                        </Typography>
                        <Typography variant="caption" display="block">
                            • 支持模糊: {deviceCapability.canUseBlur ? '是' : '否'}
                        </Typography>
                        <Typography variant="caption" display="block">
                            • 渲染时间: {deviceCapability.blurRenderTime.toFixed(2)}ms
                        </Typography>
                    </Box>
                    
                    <Typography variant="caption" display="block" gutterBottom>
                        <strong>模糊配置:</strong>
                    </Typography>
                    <Box ml={1} mb={1}>
                        <Typography variant="caption" display="block">
                            • 启用状态: {blurSettings.enableBlur ? '开启' : '关闭'}
                        </Typography>
                        <Typography variant="caption" display="block">
                            • 强度系数: {(blurSettings.blurIntensity * 100).toFixed(0)}%
                        </Typography>
                        <Typography variant="caption" display="block">
                            • 最大实例: {blurSettings.maxBlurInstances}
                        </Typography>
                        <Typography variant="caption" display="block">
                            • 降级模式: {blurSettings.fallbackMode}
                        </Typography>
                    </Box>
                    
                    <Typography variant="caption" display="block" gutterBottom>
                        <strong>性能建议:</strong>
                    </Typography>
                    <Box ml={1}>
                        <Typography variant="caption" display="block" color="lightblue">
                            {advice.recommendation}
                        </Typography>
                        {advice.suggestions.map((suggestion, index) => (
                            <Typography key={index} variant="caption" display="block" sx={{ fontSize: '0.65rem' }}>
                                • {suggestion}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default BlurPerformanceMonitor;
