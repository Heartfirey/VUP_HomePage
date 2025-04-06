import React from 'react';
import publicRoutes from './publicRoutes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from '../layout/MainLayout';


export default function GlobalRouter() {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    {publicRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.element />}
                        />
                    ))}
                </Route>
            </Routes>
        </Router>
    );
};
