// 性能监控管理器
import config from '../config';

class PerformanceMonitorManager {
    constructor() {
        this.isEnabled = false;
        this.monitorConfig = null;
        this.init();
    }

    init() {
        this.monitorConfig = config.performanceMonitor || {};
        this.isEnabled = this.monitorConfig.enableBlurMonitor || false;
        
        if (this.isEnabled && this.monitorConfig.enableConsoleLogging) {
            console.log('Performance Monitor initialized:', this.monitorConfig);
        }
    }

    // 检查是否启用特定监控功能
    isFeatureEnabled(feature) {
        switch (feature) {
            case 'blurMonitor':
                return this.monitorConfig.enableBlurMonitor || false;
            case 'performancePanel':
                return this.monitorConfig.enablePerformancePanel || false;
            case 'consoleLogging':
                return this.monitorConfig.enableConsoleLogging || false;
            default:
                return false;
        }
    }

    // 获取监控配置
    getConfig(key) {
        return this.monitorConfig[key];
    }

    // 条件性日志输出
    log(message, data = null) {
        if (this.isFeatureEnabled('consoleLogging')) {
            if (data) {
                console.log(`[Performance Monitor] ${message}`, data);
            } else {
                console.log(`[Performance Monitor] ${message}`);
            }
        }
    }

    // 条件性警告输出
    warn(message, data = null) {
        if (this.isFeatureEnabled('consoleLogging')) {
            if (data) {
                console.warn(`[Performance Monitor] ${message}`, data);
            } else {
                console.warn(`[Performance Monitor] ${message}`);
            }
        }
    }

    // 条件性错误输出
    error(message, data = null) {
        if (this.isFeatureEnabled('consoleLogging')) {
            if (data) {
                console.error(`[Performance Monitor] ${message}`, data);
            } else {
                console.error(`[Performance Monitor] ${message}`);
            }
        }
    }

    // 性能测量包装器
    measurePerformance(name, fn) {
        if (!this.isFeatureEnabled('consoleLogging')) {
            return fn();
        }

        const startTime = performance.now();
        const result = fn();
        const endTime = performance.now();
        
        this.log(`${name} 执行时间: ${(endTime - startTime).toFixed(2)}ms`);
        
        return result;
    }

    // 异步性能测量包装器
    async measureAsyncPerformance(name, asyncFn) {
        if (!this.isFeatureEnabled('consoleLogging')) {
            return await asyncFn();
        }

        const startTime = performance.now();
        const result = await asyncFn();
        const endTime = performance.now();
        
        this.log(`${name} 执行时间: ${(endTime - startTime).toFixed(2)}ms`);
        
        return result;
    }

    // 获取当前性能统计
    getPerformanceStats() {
        return {
            blurInstances: document.querySelectorAll('[data-blur-instance]').length,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null,
            timing: performance.timing ? {
                domLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                pageLoaded: performance.timing.loadEventEnd - performance.timing.navigationStart
            } : null
        };
    }

    // 监控DOM变化
    observeBlurInstances(callback) {
        if (!this.isFeatureEnabled('blurMonitor')) {
            return () => {}; // 返回空的清理函数
        }

        const observer = new MutationObserver(() => {
            const instances = document.querySelectorAll('[data-blur-instance]').length;
            callback(instances);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-blur-instance']
        });

        return () => observer.disconnect();
    }

    // 获取推荐的优化建议
    getOptimizationSuggestions() {
        const stats = this.getPerformanceStats();
        const suggestions = [];

        if (stats.blurInstances > 5) {
            suggestions.push({
                type: 'warning',
                message: `当前有 ${stats.blurInstances} 个模糊实例，建议控制在5个以内`,
                action: '减少同时显示的模糊元素数量'
            });
        }

        if (stats.memoryUsage && stats.memoryUsage.used > 100) {
            suggestions.push({
                type: 'warning',
                message: `内存使用量较高 (${stats.memoryUsage.used}MB)`,
                action: '考虑禁用一些视觉效果或优化组件渲染'
            });
        }

        if (suggestions.length === 0) {
            suggestions.push({
                type: 'success',
                message: '性能状况良好',
                action: '继续保持当前配置'
            });
        }

        return suggestions;
    }
}

// 创建单例实例
const performanceMonitor = new PerformanceMonitorManager();

export default performanceMonitor;
