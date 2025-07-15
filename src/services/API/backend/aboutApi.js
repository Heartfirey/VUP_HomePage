import apiClient from "./apiClient";
import { safeThrow } from "../../../utils/exception_manage";

// 获取关于信息
export const getAboutInfo = async () => {
    try {
        const response = await apiClient.get('/about/info');
        return {
            code: response.data.code || 200,
            message: response.data.msg || 'success',
            data: response.data.data
        };
    } catch (error) {
        console.error("Error fetching about info:", error);
        safeThrow(error);
    }
};

// 获取开发日志
export const getDevLogs = async (limit = 3) => {
    try {
        const response = await apiClient.get('/about/dev_logs', {
            params: { limit }
        });
        return {
            code: response.data.code || 200,
            message: response.data.msg || 'success',
            data: response.data.data
        };
    } catch (error) {
        console.error("Error fetching dev logs:", error);
        safeThrow(error);
    }
};

// 获取友情链接
export const getFriendLinks = async () => {
    try {
        const response = await apiClient.get('/about/friend_links');
        return {
            code: response.data.code || 200,
            message: response.data.msg || 'success',
            data: response.data.data
        };
    } catch (error) {
        console.error("Error fetching friend links:", error);
        safeThrow(error);
    }
};
