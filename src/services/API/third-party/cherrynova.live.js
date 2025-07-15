import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cherrynovaApi = createApi({
    reducerPath: 'cherrynovaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://workers.cherrynova.live/',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUserLiveGuild: builder.query({
            query: (uid) => `/bilibili/live-guild/${uid}`,
        }),
        getUserFollowing: builder.query({
            query: (uid) => `/bilibili/following/${uid}`,
        }),
    }),
});

export const {
    useGetUserLiveGuildQuery,
    useGetUserFollowingQuery,
} = cherrynovaApi;
