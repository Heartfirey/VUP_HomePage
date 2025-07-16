// src/services/API/backend/liveTypeApi.js
import apiClient from './apiClient';

/**
 * 获取所有直播类型
 * @returns {Promise} 包含直播类型数据的Promise
 */
export const getLiveTypes = async () => {
    try {
        const response = await apiClient.get('/live-records/live-types');
        return response.data.data; // 返回实际的直播类型数据
    } catch (error) {
        console.error('Failed to fetch live types:', error);
        throw error;
    }
};
