import MainPage from '../pages/MainPage';
import AboutPage from '../pages/AboutPage';
import BlogPage from '../pages/BlogPage';
import UserPage from '../pages/UserPage';
import SchedulePage from '../pages/SchedulePage';
import RecordPage from '../pages/RecordPage';

import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import ShareTwoToneIcon from '@mui/icons-material/ShareTwoTone';
import PollTwoToneIcon from '@mui/icons-material/PollTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import UserIcon from '@mui/icons-material/Person2TwoTone';

const publicRoutes = [
    {
        path: '/',
        element: MainPage,
        label: '歌单',
        icon: HomeTwoToneIcon
    },
    {
        path: '/blog',
        element: BlogPage,
        label: '动态',
        icon: ShareTwoToneIcon
    },
    {
        path: '/schedule',
        element: SchedulePage,
        label: '日程',
        icon: CalendarMonthTwoToneIcon
    },
    {
        path: '/record',
        element: RecordPage,
        label: '录播',
        icon: VideocamTwoToneIcon
    },
    {
        path: '/stat',
        element: UserPage,
        label: '统计',
        icon: PollTwoToneIcon
    },
    {
        path: '/about',
        element: AboutPage,
        label: '关于',
        icon: UserIcon
    },
];

export default publicRoutes;
