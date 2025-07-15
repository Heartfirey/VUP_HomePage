import React, { useState } from 'react';
import Pagination from '@mui/material/Pagination';

const UserCard = ({ avatarUrl, username, extraComponent, extraInfo }) => {
    return (
        <div className="bg-gray-100/50 p-4 rounded-lg flex flex-col items-center">
            <img
                src={avatarUrl}
                alt={username}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover mb-2"
            />
            <div className="font-semibold text-lg mb-1 text-center">{username}</div>
            {extraComponent && <div className="mb-1">{extraComponent}</div>}
            {extraInfo && <div className="text-sm text-gray-600">{extraInfo}</div>}
        </div>
    );
};

const SuperUserCard = ({ avatarUrl, username, extraComponent, extraInfo, badgeColor, badgeIcon: BadgeIcon }) => {
    return (
        <div className="relative bg-gray-100/50 p-4 rounded-lg flex flex-row items-center overflow-hidden">
            <div
                className="absolute top-0 right-0"
                style={{
                    width: '54px',
                    height: '54px',
                    backgroundColor: badgeColor, 
                    clipPath: 'polygon(100% 0, 100% 100%, 0 0)'
                }}
            >
                <div className="flex items-center justify-center w-full h-full">
                    <BadgeIcon className="w-4 h-4 text-white" style={{ transform: 'translate(45%, -45%)' }} />
                </div>
            </div>
            <img
                src={avatarUrl}
                alt={username}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div className="flex flex-col">
                <div className="font-semibold text-lg text-left">{username}</div>
                {extraComponent && <div className="mb-1 text-left">{extraComponent}</div>}
                {extraInfo && <div className="text-sm text-gray-600 text-left">{extraInfo}</div>}
            </div>
        </div>
    );
};

export const Top3UserGrid = ({ users, pageSize = 3 }) => {
    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {users.slice(0, pageSize).map((user, index) => (
                    <SuperUserCard
                        key={user.id || index}
                        avatarUrl={user.avatarUrl}
                        username={user.username}
                        extraComponent={user.extraComponent}
                        extraInfo={user.extraInfo}
                        badgeColor={user.badgeColor}
                        badgeIcon={user.badgeIcon}
                    />
                ))}
            </div>
        </div>
    );
}

const BiliUserGrid = ({ users, pageSize = 10, maxHeight = 600 }) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(users.length / pageSize);

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    const startIndex = (page - 1) * pageSize;
    const currentUsers = users.slice(startIndex, startIndex + pageSize);

    return (
        <div>
            <div
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                style={{ maxHeight: maxHeight, overflowY: 'auto' }}
            >
                {currentUsers.map((user, index) => (
                    <UserCard
                        key={user.id || index}
                        avatarUrl={user.avatarUrl}
                        username={user.username}
                        extraComponent={user.extraComponent}
                        extraInfo={user.extraInfo}
                    />
                ))}
            </div>

            <div className="mt-4 flex justify-center">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined" shape="rounded"
                    color="primary"
                />
            </div>
        </div>
    );
};

export default BiliUserGrid;
