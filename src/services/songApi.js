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

export const getSongList = async (songType, pageNum, pageSize) => {
    try {
        // console.log("!!! Fetching song list with params:", { songType, pageNum, pageSize });
        const response = await apiClient.get('/getSongList', {
            params: {
                songType,
                pageNum,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching song list:", error);
        throw error;
    }
}

export const getSongListByName = async (songName, pageNum, pageSize) => {
    try {
        const response = await apiClient.get('/getSongList', {
            params: {
                songName,
                pageNum,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching song list by name:", error);
        throw error;
    }
}

export const getSongListById = async (songId, pageNum, pageSize) => {
    try {
        const id = parseInt(songId, 10);
        const response = await apiClient.get('/getSongList', {
            params: {
                id, pageNum, pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching song list by ID:", error);
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
