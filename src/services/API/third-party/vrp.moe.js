import config from '../../../config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const vrpApi = createApi({
    reducerPath: 'vrpApi',
    baseQuery: fetchBaseQuery({
        baseUrl: config.api.externalWatcherAPIUrl,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUserInfo: builder.query({
            query: (uid) => `/bilibili/user-info/${uid}`,
        }),
        getLiveFansMember: builder.query({
            query: (uid) => ({
                url: `/bilibili/live-fans-members/${uid}`,
                params: { p: 1 },
            }),
        }),
        getFansHistory: builder.query({
            query: (uid) => ({
                url: `/bilibili/fans-history/${uid}`,
                params: { p: 1 },
            }),
        }),
        getFamousFans: builder.query({
            query: (uid) => ({
                url: `/bilibili/famous-fans/${uid}`,
                params: { p: 1 },
            }),
        }),
        getLiveGuards: builder.query({
            query: (uid) => ({
                url: `/bilibili/live-guards/${uid}`,
                params: { p: 1 },
            }),
        }),
        getLiveGuardsHistory: builder.query({
            query: (uid) => ({
                url: `/bilibili/live-guards-history/${uid}`,
                params: { p: 1 },
            }),
        }),
        getUpower: builder.query({
            query: (uid) => ({
                url: `/bilibili/upower/${uid}`,
                params: { p: 1 },
            }),
        }),
        getUserMedals: builder.query({
            query: (uid) => ({
                url: `/bilibili/user-medals/${uid}`,
                params: { p: 1 },
            }),
        }),
        getSuits: builder.query({
            query: (uid) => ({
                url: `/laplace/suits`,
                params: { publisher: uid },
            }),
        }),
    }),
});

export const {
    useGetUserInfoQuery,
    useGetLiveFansMemberQuery,
    useGetFansHistoryQuery,
    useGetFamousFansQuery,
    useGetLiveGuardsQuery,
    useGetLiveGuardsHistoryQuery,
    useGetUpowerQuery,
    useGetUserMedalsQuery,
    useGetSuitsQuery,
} = vrpApi;
