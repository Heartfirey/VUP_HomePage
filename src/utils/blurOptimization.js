// 毛玻璃效果性能优化工具
import { performanceConfig } from './performanceConfig';
import { useEffect } from 'react';

// 延迟导入以避免循环依赖
let performanceMonitor = null;
const getPerformanceMonitor = async () => {
    if (!performanceMonitor) {
        performanceMonitor = (await import('./performanceMonitor')).default;
    }
    return performanceMonitor;
};

class BlurOptimization {
    constructor() {
        this.isInitialized = false;
        this.deviceCapability = null;
        this.blurSettings = null;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.deviceCapability = this.detectGPUCapability();
        this.blurSettings = this.calculateOptimalBlurSettings();
        this.isInitialized = true;
        
        // 根据配置决定是否输出日志
        this.logPerformanceInfo();
    }

    async logPerformanceInfo() {
        try {
            const monitor = await getPerformanceMonitor();
            monitor.log('模糊优化系统初始化完成', {
                capability: this.deviceCapability,
                settings: this.blurSettings
            });
        } catch (error) {
            // 降级：如果无法获取监控器，在开发环境下仍然输出日志
            if (process.env.NODE_ENV === 'development') {
                console.log('Blur Optimization initialized:', {
                    capability: this.deviceCapability,
                    settings: this.blurSettings
                });
            }
        }
    }

    // 检测GPU性能能力
    detectGPUCapability() {
        const performanceInfo = performanceConfig.detectDevicePerformance();
        
        // 获取GPU信息
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        let gpuTier = 'low';
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                // 简单的GPU分级
                if (renderer.includes('NVIDIA') || renderer.includes('AMD') || renderer.includes('Intel Iris')) {
                    gpuTier = 'high';
                } else if (!renderer.includes('Mali') && !renderer.includes('Adreno')) {
                    gpuTier = 'medium';
                }
            }
        }
        
        // 性能测试：测量简单blur的渲染时间
        const testElement = document.createElement('div');
        testElement.style.cssText = `
            position: fixed;
            top: -100px;
            width: 100px;
            height: 100px;
            backdrop-filter: blur(20px);
            z-index: -1000;
        `;
        document.body.appendChild(testElement);
        
        const startTime = performance.now();
        // 强制重排以触发渲染
        const height = testElement.offsetHeight;
        const renderTime = performance.now() - startTime;
        
        document.body.removeChild(testElement);
        
        return {
            ...performanceInfo,
            gpuTier,
            blurRenderTime: renderTime,
            canUseBlur: renderTime < 5 && gpuTier !== 'low' // 5ms阈值
        };
    }

    // 计算最优的模糊设置
    calculateOptimalBlurSettings() {
        const { isLowPerformance, canUseBlur, gpuTier, isMobile } = this.deviceCapability;
        
        if (!canUseBlur || isLowPerformance) {
            return {
                enableBlur: false,
                fallbackMode: 'solid', // 使用纯色背景替代
                maxBlurInstances: 0
            };
        }
        
        let blurIntensity, maxInstances;
        
        switch (gpuTier) {
            case 'high':
                blurIntensity = isMobile ? 0.8 : 1.0;
                maxInstances = isMobile ? 4 : 6;
                break;
            case 'medium':
                blurIntensity = 0.6;
                maxInstances = isMobile ? 2 : 3;
                break;
            default: // low
                blurIntensity = 0.4;
                maxInstances = 1;
        }
        
        return {
            enableBlur: true,
            blurIntensity,
            maxBlurInstances: maxInstances,
            fallbackMode: 'reduced', // 降低质量的模糊
            useWillChange: gpuTier === 'high', // 高性能设备使用 will-change
            enableSaturation: gpuTier !== 'low' // 是否启用saturate效果
        };
    }

    // 获取优化后的模糊样式
    getOptimizedBlurStyle(originalBlur = 24, priority = 'normal') {
        if (!this.blurSettings.enableBlur) {
            return this.getFallbackStyle(priority);
        }
        
        const adjustedBlur = Math.round(originalBlur * this.blurSettings.blurIntensity);
        
        const baseStyle = {
            backdropFilter: `blur(${adjustedBlur}px)${this.blurSettings.enableSaturation ? ' saturate(180%)' : ''}`,
            WebkitBackdropFilter: `blur(${adjustedBlur}px)${this.blurSettings.enableSaturation ? ' saturate(180%)' : ''}`,
        };
        
        if (this.blurSettings.useWillChange) {
            baseStyle.willChange = 'backdrop-filter';
        }
        
        return baseStyle;
    }

    // 获取降级样式
    getFallbackStyle(priority = 'normal') {
        const { fallbackMode } = this.blurSettings;
        
        if (fallbackMode === 'solid') {
            // 使用纯色背景
            return {
                backgroundColor: priority === 'high' 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
            };
        } else {
            // 使用CSS滤镜替代（性能更好）
            return {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                filter: 'opacity(0.9)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
            };
        }
    }

    // 检查是否可以创建新的模糊实例
    canCreateBlurInstance() {
        const currentInstances = document.querySelectorAll('[data-blur-instance]').length;
        return currentInstances < this.blurSettings.maxBlurInstances;
    }

    // 注册模糊实例
    registerBlurInstance(element) {
        if (this.canCreateBlurInstance()) {
            element.setAttribute('data-blur-instance', 'true');
            return true;
        }
        return false;
    }

    // 注销模糊实例
    unregisterBlurInstance(element) {
        element.removeAttribute('data-blur-instance');
    }

    // 获取性能建议
    getPerformanceAdvice() {
        return {
            recommendation: this.deviceCapability.canUseBlur ? 
                '设备支持硬件加速模糊效果' : 
                '建议使用降级方案以提升性能',
            suggestions: [
                this.blurSettings.enableBlur ? 
                    `当前设备最多支持 ${this.blurSettings.maxBlurInstances} 个并发模糊效果` :
                    '建议使用纯色背景替代模糊效果',
                `模糊强度已调整为原始值的 ${Math.round(this.blurSettings.blurIntensity * 100)}%`,
                this.deviceCapability.isMobile ? 
                    '移动设备检测：已启用移动端优化' : 
                    '桌面设备：可以使用完整特效'
            ]
        };
    }
}

// 创建单例实例
const blurOptimization = new BlurOptimization();

export default blurOptimization;

// 导出便捷方法
export const getOptimizedBlurStyle = (blur, priority) => 
    blurOptimization.getOptimizedBlurStyle(blur, priority);

export const useBlurInstance = (elementRef) => {
    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;
        
        const canCreate = blurOptimization.registerBlurInstance(element);
        
        return () => {
            if (canCreate) {
                blurOptimization.unregisterBlurInstance(element);
            }
        };
    }, [elementRef]);
};
