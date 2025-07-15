import apiClient from "./apiClient";
import config from '../../../config';
import { safeThrow } from '../../../utils/exception_manage';

export const getWeeks = async (offset) => {
    try {
        const response = await apiClient.get('/weeks',{
            params: {
                limit: config.scheduleStyle.rowPerPage,
                offset: offset || 0
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weeks:', error);
        safeThrow(error);
    }
}

