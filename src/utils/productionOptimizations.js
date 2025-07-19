// 生产环境性能优化工具
import { performanceConfig } from './performanceConfig';

// 检测是否为生产环境
const isProduction = process.env.NODE_ENV === 'production';

// 性能监控和优化配置
class ProductionOptimizations {
    constructor() {
        this.isInitialized = false;
        this.deviceCapability = null;
        this.animationSettings = null;
        this.renderOptimizations = null;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.deviceCapability = this.detectDeviceCapability();
        this.animationSettings = this.calculateOptimalAnimationSettings();
        this.renderOptimizations = this.setupRenderOptimizations();
        this.isInitialized = true;
        
        // 生产环境下应用优化
        if (isProduction) {
            this.applyProductionOptimizations();
        }
    }

    // 检测设备性能能力
    detectDeviceCapability() {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isLowEndDevice = /Android.*Chrome\/[0-5][0-9]|iPhone.*OS [0-9]_|iPad.*OS [0-9]_/.test(userAgent);
        
        // 检测GPU性能
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        let gpuTier = 'medium';
        let supportsHardwareAcceleration = false;
        
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                supportsHardwareAcceleration = true;
                
                // GPU分级
                if (renderer.includes('NVIDIA GTX') || renderer.includes('NVIDIA RTX') || 
                    renderer.includes('AMD RX') || renderer.includes('Intel Iris Pro')) {
                    gpuTier = 'high';
                } else if (renderer.includes('Mali-G') || renderer.includes('Adreno 6') || 
                          renderer.includes('Intel Iris')) {
                    gpuTier = 'medium';
                } else {
                    gpuTier = 'low';
                }
            }
        }

        // 内存检测
        const memoryInfo = navigator.deviceMemory || (navigator.hardwareConcurrency > 4 ? 8 : 4);
        const isLowMemory = memoryInfo < 4;

        // CPU核心数检测
        const cpuCores = navigator.hardwareConcurrency || 4;
        const isLowCPU = cpuCores < 4;

        return {
            isMobile,
            isLowEndDevice,
            gpuTier,
            supportsHardwareAcceleration,
            memoryGB: memoryInfo,
            isLowMemory,
            cpuCores,
            isLowCPU,
            isLowPerformance: isLowEndDevice || isLowMemory || isLowCPU || gpuTier === 'low'
        };
    }

    // 计算最优动画设置
    calculateOptimalAnimationSettings() {
        const { isLowPerformance, isMobile, gpuTier, supportsHardwareAcceleration } = this.deviceCapability;
        
        let animationQuality, frameRate, enableComplexAnimations, enableParticles;
        
        if (isLowPerformance) {
            animationQuality = 'low';
            frameRate = 30;
            enableComplexAnimations = false;
            enableParticles = false;
        } else if (isMobile) {
            animationQuality = 'medium';
            frameRate = 60;
            enableComplexAnimations = gpuTier !== 'low';
            enableParticles = false;
        } else {
            animationQuality = gpuTier === 'high' ? 'high' : 'medium';
            frameRate = 60;
            enableComplexAnimations = true;
            enableParticles = gpuTier === 'high';
        }

        return {
            animationQuality,
            frameRate,
            enableComplexAnimations,
            enableParticles,
            useHardwareAcceleration: supportsHardwareAcceleration,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            // Framer Motion 优化设置
            framerMotionConfig: {
                // 生产环境下减少动画复杂度
                transition: {
                    type: isLowPerformance ? 'tween' : 'spring',
                    duration: isLowPerformance ? 0.2 : 0.3,
                    ease: isLowPerformance ? 'easeOut' : 'easeInOut'
                },
                // 启用硬件加速
                style: supportsHardwareAcceleration ? {
                    transform: 'translateZ(0)',
                    willChange: 'transform, opacity'
                } : {}
            }
        };
    }

    // 设置渲染优化
    setupRenderOptimizations() {
        const { isLowPerformance, isMobile } = this.deviceCapability;
        
        return {
            // 虚拟化长列表
            enableVirtualization: true,
            virtualizedThreshold: isMobile ? 20 : 50,
            
            // 图片懒加载
            enableLazyLoading: true,
            lazyLoadingThreshold: isMobile ? '100px' : '200px',
            
            // 组件懒加载
            enableComponentLazyLoading: true,
            
            // 防抖和节流
            debounceDelay: isLowPerformance ? 300 : 150,
            throttleDelay: isLowPerformance ? 100 : 50,
            
            // 渲染批处理
            enableBatching: true,
            batchSize: isLowPerformance ? 5 : 10,
            
            // CSS优化
            enableCSSOptimizations: true,
            useTransform3d: this.deviceCapability.supportsHardwareAcceleration,
            
            // 内存管理
            enableMemoryOptimizations: isLowPerformance,
            maxCacheSize: this.deviceCapability.memoryGB * 50 // MB
        };
    }

    // 应用生产环境优化
    applyProductionOptimizations() {
        // 1. 设置全局CSS优化
        this.applyCSSOptimizations();
        
        // 2. 优化动画性能
        this.optimizeAnimations();
        
        // 3. 设置内存管理
        this.setupMemoryManagement();
        
        // 4. 优化事件处理
        this.optimizeEventHandlers();
    }

    // 应用CSS优化
    applyCSSOptimizations() {
        const style = document.createElement('style');
        style.textContent = `
            /* 生产环境CSS优化 */
            * {
                /* 启用硬件加速 */
                ${this.renderOptimizations.useTransform3d ? 'transform: translateZ(0);' : ''}
                /* 优化渲染性能 */
                backface-visibility: hidden;
                perspective: 1000px;
            }
            
            /* 优化动画性能 */
            .animate-element {
                will-change: transform, opacity;
                transform: translateZ(0);
            }
            
            /* 减少重绘 */
            .no-select {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            /* 优化滚动性能 */
            .smooth-scroll {
                -webkit-overflow-scrolling: touch;
                scroll-behavior: smooth;
            }
            
            /* 低性能设备优化 */
            ${this.deviceCapability.isLowPerformance ? `
                .complex-animation {
                    animation-duration: 0.2s !important;
                    transition-duration: 0.2s !important;
                }
                
                .disable-on-low-perf {
                    display: none !important;
                }
            ` : ''}
        `;
        document.head.appendChild(style);
    }

    // 优化动画
    optimizeAnimations() {
        // 设置全局动画配置
        window.ANIMATION_CONFIG = this.animationSettings;
        
        // 如果设备性能较低，减少动画
        if (this.deviceCapability.isLowPerformance) {
            // 禁用复杂动画
            document.documentElement.style.setProperty('--animation-duration', '0.2s');
            document.documentElement.style.setProperty('--transition-duration', '0.2s');
        }
    }

    // 设置内存管理
    setupMemoryManagement() {
        if (this.renderOptimizations.enableMemoryOptimizations) {
            // 定期清理内存
            setInterval(() => {
                this.cleanupMemory();
            }, 30000); // 30秒清理一次
        }
    }

    // 清理内存
    cleanupMemory() {
        // 清理未使用的图片缓存
        const images = document.querySelectorAll('img[data-cached]');
        images.forEach(img => {
            if (!this.isElementVisible(img)) {
                img.removeAttribute('data-cached');
                img.src = '';
            }
        });
        
        // 强制垃圾回收（如果支持）
        if (window.gc) {
            window.gc();
        }
    }

    // 检查元素是否可见
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 优化事件处理
    optimizeEventHandlers() {
        // 使用被动事件监听器
        const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'scroll'];
        passiveEvents.forEach(eventType => {
            document.addEventListener(eventType, () => {}, { passive: true });
        });
    }

    // 获取优化的Framer Motion配置
    getOptimizedMotionConfig(baseConfig = {}) {
        const { framerMotionConfig, reducedMotion, enableComplexAnimations } = this.animationSettings;
        
        if (reducedMotion) {
            return {
                ...baseConfig,
                initial: false,
                animate: baseConfig.animate,
                transition: { duration: 0 }
            };
        }
        
        if (!enableComplexAnimations) {
            return {
                ...baseConfig,
                transition: {
                    ...framerMotionConfig.transition,
                    ...baseConfig.transition
                }
            };
        }
        
        return {
            ...baseConfig,
            transition: {
                ...framerMotionConfig.transition,
                ...baseConfig.transition
            },
            style: {
                ...framerMotionConfig.style,
                ...baseConfig.style
            }
        };
    }

    // 获取优化的CSS动画样式
    getOptimizedAnimationStyle(baseStyle = {}) {
        const { useTransform3d } = this.renderOptimizations;
        const { isLowPerformance } = this.deviceCapability;
        
        return {
            ...baseStyle,
            ...(useTransform3d && { transform: 'translateZ(0)' }),
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            ...(isLowPerformance && {
                animationDuration: '0.2s',
                transitionDuration: '0.2s'
            })
        };
    }

    // 获取性能建议
    getPerformanceAdvice() {
        const { isLowPerformance, gpuTier, memoryGB, cpuCores } = this.deviceCapability;
        
        return {
            deviceInfo: {
                performance: isLowPerformance ? 'Low' : 'Good',
                gpu: gpuTier,
                memory: `${memoryGB}GB`,
                cpu: `${cpuCores} cores`
            },
            recommendations: [
                isLowPerformance ? '设备性能较低，已启用性能优化模式' : '设备性能良好，可以使用完整特效',
                `动画质量设置为: ${this.animationSettings.animationQuality}`,
                `目标帧率: ${this.animationSettings.frameRate}fps`,
                this.animationSettings.enableComplexAnimations ? '启用复杂动画' : '禁用复杂动画以提升性能'
            ]
        };
    }
}

// 创建单例实例
const productionOptimizations = new ProductionOptimizations();

// 导出便捷方法
export const getOptimizedMotionConfig = (config) => 
    productionOptimizations.getOptimizedMotionConfig(config);

export const getOptimizedAnimationStyle = (style) => 
    productionOptimizations.getOptimizedAnimationStyle(style);

export const getDeviceCapability = () => 
    productionOptimizations.deviceCapability;

export const getAnimationSettings = () => 
    productionOptimizations.animationSettings;

export const getRenderOptimizations = () => 
    productionOptimizations.renderOptimizations;

export default productionOptimizations;
