// src/hooks/useLiveTypes.js
import { useState, useEffect } from 'react';
import { getLiveTypes } from '../services/API/backend/liveTypeApi';

/**
 * Hook for managing live types data
 * @returns {Object} Contains liveTypes data, loading state, and error state
 */
export const useLiveTypes = () => {
    const [liveTypes, setLiveTypes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLiveTypes = async () => {
            try {
                setLoading(true);
                const data = await getLiveTypes();
                setLiveTypes(data);
                setError(null);
            } catch (err) {
                console.error('Failed to load live types:', err);
                setError(err);
                // Use default empty object if API fails
                setLiveTypes({});
            } finally {
                setLoading(false);
            }
        };

        fetchLiveTypes();
    }, []);

    /**
     * 获取类型的颜色配置，保持与现有代码兼容
     * @param {string} type 类型标识
     * @returns {Array} [backgroundColorWithAlpha, solidColor] 格式的颜色数组
     */
    const getTypeColors = (type) => {
        const typeData = liveTypes[type] || liveTypes['default'];
        if (typeData && typeData.backgroundColor) {
            // 为了保持兼容性，返回类似config的格式
            const bgColor = typeData.backgroundColor;
            // 如果是rgba格式，调整透明度；如果是hex，转换为rgba
            const bgColorWithAlpha = adjustColorAlpha(bgColor, 0.3);
            if (bgColorWithAlpha) {
                return [bgColorWithAlpha, bgColor];
            }
        }
        
        // 如果API数据不存在且没有default类型，返回null让调用方处理
        return null;
    };

    // 辅助函数：处理颜色透明度
    const adjustColorAlpha = (color, alpha) => {
        // 检查color是否为有效值
        if (!color || typeof color !== 'string') {
            return null;
        }
        
        // 如果已经是rgba格式，调整透明度
        if (color.startsWith('rgba(')) {
            return color.replace(/rgba\(([^)]+)\)/, (match, values) => {
                const parts = values.split(',');
                return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
            });
        }
        
        // 如果是rgb格式，添加透明度
        if (color.startsWith('rgb(')) {
            return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
        }
        
        // 如果是hex格式，转换为rgba
        if (color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        
        // 默认返回原色
        return color;
    };

    /**
     * 获取类型的名称
     * @param {string} type 类型标识
     * @returns {string} 类型名称
     */
    const getTypeName = (type) => {
        return liveTypes[type]?.name || type;
    };

    /**
     * 获取类型的直接颜色值
     * @param {string} type 类型标识
     * @returns {Object} 包含backgroundColor和foregroundColor的对象
     */
    const getTypeDirectColors = (type) => {
        const typeData = liveTypes[type] || liveTypes['default'];
        if (typeData && typeData.backgroundColor && typeData.foregroundColor) {
            return {
                backgroundColor: typeData.backgroundColor,
                foregroundColor: typeData.foregroundColor
            };
        }
        
        // 如果API数据不存在且没有default类型，返回null让调用方处理
        return null;
    };

    return {
        liveTypes,
        loading,
        error,
        getTypeColors,
        getTypeName,
        getTypeDirectColors
    };
};

export default useLiveTypes;
