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
        if (!keyword || keyword.trim() === '') {
            return []; // Return empty array if keyword is empty
        }
        const response = await apiClient.get(`/songs/get_song_blur?keyword=${encodeURIComponent(keyword)}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching song by keyword:", error);
        safeThrow(error);
    }
}

export const getSongDetails = async (songId) => {
    try {
        const response = await apiClient.get(`/songs/details/${songId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching song details:", error);
        safeThrow(error);
    }
}

export const updateSongBilibiliVideos = async (songId, videos) => {
    try {
        const response = await apiClient.put(`/private/songs/${songId}/bilibili-videos`, {
            videos: videos
        });
        return response.data;
    } catch (error) {
        console.error("Error updating song bilibili videos:", error);
        safeThrow(error);
    }
}

export const searchSongsByLyrics = async (keyword, pageNum = 1, pageSize = 20) => {
    try {
        if (!keyword || keyword.trim() === '') {
            return { data: { list: [], total: 0 } }; // Return empty result if keyword is empty
        }
        const response = await apiClient.get('/songs/search-by-lyrics', {
            params: {
                keyword: keyword.trim(),
                pageNum,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching songs by lyrics:", error);
        safeThrow(error);
    }
}
