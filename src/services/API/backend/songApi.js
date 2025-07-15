import apiClient from "./apiClient";
import { safeThrow } from "../../../utils/exception_manage";

export const getSongNum = async () => {
    try {
        const response = await apiClient.get('/songs/get_song_num');
        return response.data;
    } catch (error) {
        console.error("Error fetching song number:", error);
        safeThrow(error);
    }
}

export const getSongListByKey = async (key, value, pageNum, pageSize) => {
    try {
        const response = await apiClient.get('/songs/get_song_list', {
            params: {
                [key]: value,
                pageNum,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching song list by key:", error);
        safeThrow(error);
    }
}

export const getSuperSongList = async (pageNum, pageSize) => {
    try {
        const response = await apiClient.get('/songs/get_super', {
            params: {
                pageNum,
                pageSize
            }
        });
        console.log("获取超级歌曲列表:", response.data.data.list);
        return response.data;
    } catch (error) {
        console.error("Error fetching super song list:", error);
        safeThrow(error);
    }
}

export const getRandomSong = async () => {
    try {
        const response = await apiClient.get('/songs/get_random_song');
        return response.data;
    } catch (error) {
        console.error("Error fetching random song:", error);
        safeThrow(error);
    }
}

export const getSongByKeyword = async (keyword) => {
    try {
        console.log("Sending keyword:", keyword);
        if (!keyword || keyword.trim() === '') {
            return []; // Return empty array if keyword is empty
        }
        
        const response = await apiClient.get(`/songs/get_song_blur?keyword=${encodeURIComponent(keyword)}`);
        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching song by keyword:", error);
        safeThrow(error);
    }
}
