// import { Navigate } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import AboutPage from '../pages/AboutPage';

import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import PollTwoToneIcon from '@mui/icons-material/PollTwoTone';

const publicRoutes = [
    {
        path: '/',
        element: MainPage,
        label: 'Home',
        icon: HomeTwoToneIcon
    },
    {
        path: '/about',
        element: AboutPage,
        label: 'About',
        icon: PollTwoToneIcon
    }
];

export default publicRoutes;
