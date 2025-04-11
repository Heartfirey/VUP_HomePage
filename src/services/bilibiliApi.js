import apiClient from "./apiClient";

export const getRoomInfo = async (roomId) => {
    try {
        const response = await apiClient.get('/bilibili/room/v1/Room/get_info', {
            params: { room_id: roomId } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching room info:', error);
        throw error;
    }
}

export const getRoomInitInfo = async (roomId) => {
    try {
        const response = await apiClient.get('/bilibili/room/v1/Room/room_init', {
            params: { id: roomId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching room init info:', error);
        throw error;
    }
}

export const getAnchorInfo = async (uid) => {
    try {
        const response = await apiClient.get('/bilibili/live_user/v1/Master/info', {
            params: { uid }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching anchor info:', error);
        throw error;
    }
}
