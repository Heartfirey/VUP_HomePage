import apiClient from "./apiClient";
import { safeThrow } from "../../../utils/exception_manage";

// 获取动态列表
export const getBlogPosts = async (params = {}) => {
    try {
        const response = await apiClient.get('/blog/posts', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        safeThrow(error);
    }
};

// 获取单个动态详情
export const getBlogPost = async (id) => {
    try {
        const response = await apiClient.get(`/blog/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching blog post:", error);
        safeThrow(error);
    }
};

// 获取首页显示的动态
export const getHomepagePosts = async () => {
    try {
        const response = await apiClient.get(`/blog/homepage-posts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching homepage posts:", error);
        safeThrow(error);
    }
};

// 点赞动态
export const likeBlogPost = async (id) => {
    try {
        const response = await apiClient.post(`/blog/posts/${id}/like`);
        return response.data;
    } catch (error) {
        console.error("Error liking blog post:", error);
        safeThrow(error);
    }
};
