import React, { useEffect, useMemo } from 'react';
import { Snow } from 'jparticles';
import sakura from '../assets/sakura.js';

const SakuraBG = React.memo(() => {
    // 根据设备性能动态调整粒子数量
    const particleConfig = useMemo(() => {
        const screenWidth = window.innerWidth;
        const isMobile = screenWidth < 768;
        const isTablet = screenWidth < 1024;
        
        // 检测是否为低性能设备
        const isLowPerformance = navigator.deviceMemory && navigator.deviceMemory < 4;
        
        let particleCount;
        if (isMobile || isLowPerformance) {
            particleCount = 8; // 移动设备或低性能设备大幅减少
        } else if (isTablet) {
            particleCount = 15; // 平板设备适中
        } else {
            particleCount = 25; // 桌面设备
        }

        return {
            num: particleCount,
            maxR: isMobile ? 8 : 12,
            minR: isMobile ? 2 : 4,
            maxSpeed: 0.3, // 降低速度减少计算
            minSpeed: 0.05,
            swing: !isMobile, // 移动设备禁用摆动效果
            swingProbability: isMobile ? 0 : 0.7, // 降低摆动概率
            spin: !isLowPerformance, // 低性能设备禁用旋转
            shape: sakura(),
        };
    }, []);

    useEffect(() => {
        let snowInstance = null;
        
        // 延迟初始化，避免阻塞渲染
        const timer = setTimeout(() => {
            if (typeof Snow === 'function') {
                snowInstance = new Snow('#snow', particleConfig);
            }
        }, 100);

        return () => {
            clearTimeout(timer);
            // 清理粒子实例
            if (snowInstance && typeof snowInstance.destroy === 'function') {
                snowInstance.destroy();
            }
        };
    }, [particleConfig]);

    return (
        <div
            id="snow"
            className="absolute inset-0 w-full h-full"
            style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9,
                pointerEvents: 'none',
            }}
        ></div>
    );
});

export default SakuraBG;
