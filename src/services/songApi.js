import apiClient from "./apiClient";

export const getSongNum = async () => {
    try {
        const response = await apiClient.get('/getSongNum');
        return response.data;
    } catch (error) {
        console.error("Error fetching song number:", error);
        throw error;
    }
}

export const getSongListByKey = async (key, value, pageNum, pageSize) => {
    try {
        const response = await apiClient.get('/getSongList', {
            params: {
                [key]: value,
                pageNum,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching song list by key:", error);
        throw error;
    }
}

export const getSuperSongList = async (pageNum, pageSize) => {
    try {
        const response = await apiClient.get('/getSuper', {
            params: {
                'isSuper': 1,
                pageNum,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching super song list:", error);
        throw error;
    }
}

export const getRandomSong = async () => {
    try {
        const response = await apiClient.get('/getRandomSong');
        return response.data;
    } catch (error) {
        console.error("Error fetching random song:", error);
        throw error;
    }
}
