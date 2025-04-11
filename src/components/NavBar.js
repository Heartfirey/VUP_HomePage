import * as React from 'react';
import config from '../config';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import { useLocation, useNavigate } from 'react-router-dom';
import publicRoutes from '../routes/publicRoutes';
import { pink, grey } from '@mui/material/colors';
const aylnAvatar = require(`../assets/${config.siteSettings.avatarFile}`);


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));

export default function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();


    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Avatar sx={{ bgcolor: 'transparent' }} variant="rounded" src={aylnAvatar} />
                    <Box className="flex-grow flex items-center justify-center">
                        {publicRoutes.map((route) => {
                            const isActive = location.pathname === route.path;
                            const IconComponent = route.icon || null;
                            return (
                                <Button
                                    key={route.path}
                                    onClick={() => navigate(route.path)}
                                    sx={{ color: isActive ? pink[600] : grey[900], '& .MuiButton-startIcon': { marginRight: '4px' } }}
                                    className={`bg-transparent mx-2`}
                                    startIcon={IconComponent ? <IconComponent /> : null}
                                >
                                    {route.label}
                                    {/* {route.path === '/' ? 'Home' : route.label} */}
                                </Button>
                            );
                        })}
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
