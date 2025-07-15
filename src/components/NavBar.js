import * as React from 'react';
import config from '../config';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import publicRoutes from '../routes/publicRoutes';
import { blue, grey } from '@mui/material/colors';
const aylnAvatar = require(`../assets/${config.siteSettings.avatarFile}`);

const StyledToolbar = styled(Toolbar, {
    shouldForwardProp: (prop) => prop !== 'isDark',
})(({ theme, isDark }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: isDark ? 16 : `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: isDark ? 'blur(40px)' : 'blur(24px)',
    WebkitBackdropFilter: isDark ? 'blur(40px)' : 'blur(24px)',
    border: '1px solid',
    borderColor: isDark 
        ? (theme.vars ? 'rgba(255 255 255 / 0.12)' : alpha(theme.palette.common.white, 0.12))
        : (theme.vars || theme).palette.divider,
    backgroundColor: isDark 
        ? (theme.vars ? `rgba(0 0 0 / 0.4)` : alpha(theme.palette.common.black, 0.5))
        : (theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
            : alpha(theme.palette.background.default, 0.4)),
    boxShadow: isDark 
        ? '0 8px 32px rgba(0 0 0 / 0.15)'
        : (theme.vars || theme).shadows[1],
    padding: '6px 12px',
    minHeight: '48px', // Set minimum height to ensure consistency
}));

export default function NavBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    // Determine whether to use dark theme based on current path
    const isDarkTheme = location.pathname === '/schedule' || location.pathname === '/record';

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
        handleMenuClose();
    };

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
                <StyledToolbar variant="dense" disableGutters isDark={isDarkTheme}>
                    <Avatar sx={{ bgcolor: 'transparent' }} variant="rounded" src={aylnAvatar} />
                    
                    {/* Horizontal scrolling navigation - Unified for mobile and desktop */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: isMobile ? 'flex-start' : 'center',
                            alignItems: 'center',
                            ml: isMobile ? 2 : 0,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: isMobile ? 1 : 2,
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                scrollBehavior: 'smooth',
                                '&::-webkit-scrollbar': {
                                    display: 'none', // Hide scrollbar
                                },
                                scrollbarWidth: 'none', // Firefox
                                msOverflowStyle: 'none', // IE/Edge
                                pb: 0.5, // Prevent button clipping
                                pt: 0.5,
                                width: '100%',
                                justifyContent: isMobile ? 'flex-start' : 'center',
                            }}
                        >
                            {publicRoutes.map((route) => {
                                const isActive = location.pathname === route.path;
                                const IconComponent = route.icon || null;
                                return (
                                    <Button
                                        key={route.path}
                                        onClick={() => navigate(route.path)}
                                        sx={{ 
                                            color: isActive 
                                                ? (isDarkTheme ? blue[400] : blue[600])
                                                : (isDarkTheme ? grey[300] : grey[900]),
                                            minWidth: isMobile ? (isActive || !IconComponent ? 'auto' : '36px') : '56px',
                                            px: isMobile ? (isActive || !IconComponent ? 1.2 : 0.4) : 1.5,
                                            py: isMobile ? 0.8 : 0.4,
                                            fontSize: isMobile ? '0.8rem' : '0.875rem',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0, // Prevent button compression
                                            borderRadius: 2,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                backgroundColor: isDarkTheme 
                                                    ? alpha(grey[50], 0.08)
                                                    : alpha(grey[900], 0.04),
                                            },
                                            '& .MuiButton-startIcon': { 
                                                marginRight: isMobile ? '3px' : '6px',
                                                fontSize: isMobile ? '14px' : '16px',
                                            },
                                            fontWeight: isActive ? 600 : 400,
                                        }}
                                        startIcon={IconComponent ? <IconComponent /> : null}
                                    >
                                        {isMobile ? (
                                            isActive ? route.label : (IconComponent ? '' : route.label)
                                        ) : (
                                            route.label
                                        )}
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
