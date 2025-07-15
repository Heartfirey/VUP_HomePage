// 性能优化配置
export const performanceConfig = {
    // 检测设备性能
    detectDevicePerformance: () => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSlowConnection = navigator.connection?.effectiveType === 'slow-2g' || navigator.connection?.effectiveType === '2g';
        const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const hasLimitedCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        return {
            isMobile,
            isSlowConnection,
            hasLimitedMemory,
            hasLimitedCores,
            isLowPerformance: isMobile || isSlowConnection || hasLimitedMemory || hasLimitedCores
        };
    },

    // 根据设备性能调整粒子数量
    getParticleCount: (baseCount = 30) => {
        const { isMobile, isLowPerformance } = performanceConfig.detectDevicePerformance();
        
        if (isLowPerformance) {
            return Math.max(Math.floor(baseCount * 0.3), 8); // 最少8个粒子
        } else if (isMobile) {
            return Math.floor(baseCount * 0.5);
        }
        return baseCount;
    },

    // 动态调整动画帧率
    getTargetFPS: () => {
        const { isLowPerformance } = performanceConfig.detectDevicePerformance();
        return isLowPerformance ? 20 : 30; // 低性能设备使用20FPS
    },

    // 是否启用某些视觉效果
    shouldEnableEffect: (effectName) => {
        const { isLowPerformance } = performanceConfig.detectDevicePerformance();
        
        const effectSettings = {
            aurora: !isLowPerformance,
            particles: !isLowPerformance,
            splashCursor: !isLowPerformance,
            blur: !isLowPerformance,
            fullBlur: !isLowPerformance, // 完整模糊效果
            reducedBlur: true, // 降级模糊效果总是可用
            animations: true, // 基础动画总是启用
        };

        return effectSettings[effectName] ?? false;
    },

    // 获取模糊效果配置
    getBlurConfig: () => {
        const { isLowPerformance, isMobile } = performanceConfig.detectDevicePerformance();
        
        if (isLowPerformance) {
            return {
                enabled: false,
                fallback: 'solid', // 使用纯色背景
                maxInstances: 0
            };
        }
        
        return {
            enabled: true,
            intensity: isMobile ? 0.7 : 1.0, // 移动端降低强度
            maxInstances: isMobile ? 3 : 5, // 限制并发数量
            useSaturation: !isMobile, // 移动端不使用饱和度
            fallback: 'reduced' // 降级到简化模糊
        };
    },

    // 防抖延迟配置
    getDebounceDelay: (type) => {
        const { isLowPerformance } = performanceConfig.detectDevicePerformance();
        
        const delays = {
            search: isLowPerformance ? 500 : 300,
            resize: isLowPerformance ? 200 : 100,
            scroll: isLowPerformance ? 100 : 50,
        };

        return delays[type] ?? 300;
    },

    // 列表渲染优化配置
    getPaginationConfig: () => {
        const { isLowPerformance } = performanceConfig.detectDevicePerformance();
        
        return {
            pageSize: isLowPerformance ? 10 : 20,
            candidateLimit: isLowPerformance ? 3 : 5,
            virtualScrollThreshold: 50,
        };
    }
};

export default performanceConfig;
