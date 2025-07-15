import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Chip,
    Avatar,
    Grid,
    Link,
    IconButton,
    Skeleton,
    useTheme,
    useMediaQuery,
    Fade,
    Zoom,
    Stack,
    Divider
} from '@mui/material';
import { 
    Info as InfoIcon,
    Update as UpdateIcon,
    Link as LinkIcon,
    OpenInNew as OpenInNewIcon,
    GitHub as GitHubIcon,
    Language as WebsiteIcon,
    CalendarMonth as CalendarIcon,
    Code as CodeIcon,
    Star as StarIcon,
    LibraryMusic as MusicIcon,
    Business as BusinessIcon,
    Assessment as DataIcon,
    Movie as EntertainmentIcon,
    FiberManualRecord as DotIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { RawBlurCardNoAnimate as BlurCard } from '../components/RawBlurCard';
import config from '../config';
import { getAboutInfo, getDevLogs, getFriendLinks } from '../services/API/backend/aboutApi';

const AboutPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [aboutInfo, setAboutInfo] = useState(null);
    const [devLogs, setDevLogs] = useState([]);
    const [friendLinks, setFriendLinks] = useState([]);
    const [loading, setLoading] = useState({
        about: true,
        devLogs: true,
        friendLinks: true
    });

    // 时间格式化函数
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            // 处理不同的日期格式
            let date;
            if (dateString.includes('T')) {
                // ISO 8601 格式：2024-12-15T00:00:00+08:00
                date = new Date(dateString);
            } else if (dateString.includes('-')) {
                // 简单格式：2024-12-15
                date = new Date(dateString + 'T00:00:00');
            } else {
                date = new Date(dateString);
            }
            
            // 检查日期是否有效
            if (isNaN(date.getTime())) {
                return dateString; // 如果无法解析，返回原始字符串
            }
            
            // 格式化为 YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.warn('Date formatting error:', error, 'Original date:', dateString);
            return dateString; // 出错时返回原始字符串
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 获取关于信息
                const aboutResponse = await getAboutInfo();
                if (aboutResponse.code === 200) {
                    setAboutInfo(aboutResponse.data);
                }
                setLoading(prev => ({ ...prev, about: false }));

                // 获取开发日志
                const devLogsResponse = await getDevLogs(3);
                if (devLogsResponse.code === 200) {
                    setDevLogs(devLogsResponse.data.logs);
                }
                setLoading(prev => ({ ...prev, devLogs: false }));

                // 获取友情链接
                const friendLinksResponse = await getFriendLinks();
                if (friendLinksResponse.code === 200) {
                    setFriendLinks(friendLinksResponse.data.links);
                }
                setLoading(prev => ({ ...prev, friendLinks: false }));

            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading({ about: false, devLogs: false, friendLinks: false });
            }
        };

        fetchData();
    }, []);

    const getCategoryColor = (category) => {
        const colorMap = {
            '官方': '#1976D2',
            '平台': '#7B1FA2', 
            '数据': '#388E3C',
            '娱乐': '#F57C00',
            '开发': '#455A64',
            '音乐': '#C2185B'
        };
        return colorMap[category] || '#616161';
    };

    const getCategoryIcon = (category) => {
        const iconMap = {
            '官方': <BusinessIcon />,
            '平台': <WebsiteIcon />,
            '数据': <DataIcon />,
            '娱乐': <EntertainmentIcon />,
            '开发': <GitHubIcon />,
            '音乐': <MusicIcon />
        };
        return iconMap[category] || <WebsiteIcon />;
    };

    const handleLinkClick = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Box className="space-y-6">
            {/* About us section */}
            <Fade in={true} timeout={600}>
                <BlurCard sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ 
                        bgcolor: 'rgba(248, 249, 250, 0.8)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        p: 3,
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Box className="flex items-center">
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: '#1976D2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 2,
                                    boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)'
                                }}
                            >
                                <InfoIcon sx={{ color: 'white', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" sx={{ 
                                    color: 'rgba(33, 37, 41, 0.9)', 
                                    fontWeight: 'bold'
                                }}>
                                    关于我们
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(108, 117, 125, 0.8)' }}>
                                    了解更多关于{config.anchorInfo.name}的信息
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box sx={{ p: 3 }}>
                        {loading.about ? (
                            <Box className="space-y-4">
                                <Skeleton variant="text" width="80%" height={40} sx={{ bgcolor: 'rgba(0,0,0,0.06)' }} />
                                <Skeleton variant="text" width="60%" height={30} sx={{ bgcolor: 'rgba(0,0,0,0.06)' }} />
                                <Skeleton variant="rectangular" width="100%" height={200} sx={{ 
                                    borderRadius: 2, 
                                    bgcolor: 'rgba(0,0,0,0.04)' 
                                }} />
                            </Box>
                        ) : (
                            <Box 
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.6)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    p: 3,
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                }}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                    components={{
                                        h1: ({ children }) => (
                                            <Typography variant="h4" sx={{ 
                                                color: 'rgba(33, 37, 41, 0.9)', 
                                                mb: 3, 
                                                fontWeight: 'bold'
                                            }}>
                                                {children}
                                            </Typography>
                                        ),
                                        h2: ({ children }) => (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                                                <Box
                                                    sx={{
                                                        width: 4,
                                                        height: 24,
                                                        bgcolor: '#1976D2',
                                                        borderRadius: 1,
                                                        mr: 2
                                                    }}
                                                />
                                                <Typography variant="h5" sx={{ 
                                                    color: 'rgba(73, 80, 87, 0.9)', 
                                                    fontWeight: '600' 
                                                }}>
                                                    {children}
                                                </Typography>
                                            </Box>
                                        ),
                                        h3: ({ children }) => (
                                            <Typography variant="h6" sx={{ 
                                                color: 'rgba(73, 80, 87, 0.8)', 
                                                mb: 2, 
                                                fontWeight: '500' 
                                            }}>
                                                {children}
                                            </Typography>
                                        ),
                                        p: ({ children }) => (
                                            <Typography variant="body1" sx={{ 
                                                color: 'rgba(108, 117, 125, 0.9)', 
                                                mb: 2, 
                                                lineHeight: 1.7 
                                            }}>
                                                {children}
                                            </Typography>
                                        ),
                                        ul: ({ children }) => (
                                            <Box component="ul" sx={{ color: 'rgba(108, 117, 125, 0.9)', pl: 0, mb: 3 }}>
                                                {children}
                                            </Box>
                                        ),
                                        li: ({ children }) => (
                                            <Box component="li" sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, listStyle: 'none' }}>
                                                <Box
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        bgcolor: '#1976D2',
                                                        borderRadius: '50%',
                                                        mt: 1,
                                                        mr: 2,
                                                        flexShrink: 0
                                                    }}
                                                />
                                                <Box>{children}</Box>
                                            </Box>
                                        ),
                                        a: ({ href, children }) => (
                                            <Link 
                                                href={href} 
                                                target="_blank" 
                                                rel="noopener,noreferrer"
                                                sx={{
                                                    color: '#1976D2',
                                                    textDecoration: 'underline',
                                                    fontWeight: 500,
                                                    '&:hover': {
                                                        color: '#1565C0'
                                                    }
                                                }}
                                            >
                                                {children}
                                            </Link>
                                        ),
                                        strong: ({ children }) => (
                                            <Box component="strong" sx={{ 
                                                color: 'rgba(33, 37, 41, 0.9)', 
                                                fontWeight: 'bold' 
                                            }}>
                                                {children}
                                            </Box>
                                        )
                                    }}
                                >
                                    {aboutInfo?.content}
                                </ReactMarkdown>
                                
                                {aboutInfo?.lastUpdateTime && (
                                    <Box 
                                        sx={{
                                            mt: 3,
                                            pt: 2,
                                            borderTop: '1px solid rgba(255, 255, 255, 0.3)'
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ 
                                            color: 'rgba(108, 117, 125, 0.7)', 
                                            display: 'flex', 
                                            alignItems: 'center' 
                                        }}>
                                            <UpdateIcon sx={{ fontSize: 16, mr: 1, opacity: 0.7 }} />
                                            最后更新: {formatDate(aboutInfo.lastUpdateTime)}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </BlurCard>
            </Fade>

            {/* Development log section */}
            <Fade in={true} timeout={800}>
                <BlurCard sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ 
                        bgcolor: 'rgba(248, 249, 250, 0.8)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        p: 3,
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Box className="flex items-center justify-between">
                            <Box className="flex items-center">
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        bgcolor: '#388E3C',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 2,
                                        boxShadow: '0 4px 15px rgba(56, 142, 60, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                    }}
                                >
                                    <CodeIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ 
                                        color: 'rgba(33, 37, 41, 0.9)', 
                                        fontWeight: 'bold'
                                    }}>
                                        开发日志
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(108, 117, 125, 0.8)' }}>
                                        最新的功能更新和改进
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip 
                                label="最近3条" 
                                size="small" 
                                sx={{ 
                                    bgcolor: 'rgba(232, 245, 232, 0.7)',
                                    color: '#2e7d32',
                                    border: '1px solid rgba(200, 230, 201, 0.5)',
                                    backdropFilter: 'blur(10px)',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        {loading.devLogs ? (
                            <Stack spacing={4}>
                                {[1, 2, 3].map((item) => (
                                    <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <Skeleton variant="circular" width={12} height={12} sx={{ 
                                            mr: 3,
                                            mt: 1,
                                            bgcolor: 'rgba(56, 142, 60, 0.2)' 
                                        }} />
                                        <Box sx={{ flex: 1 }}>
                                            <BlurCard sx={{ 
                                                p: 3, 
                                                borderRadius: 2,
                                                bgcolor: 'rgba(255, 255, 255, 0.4)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)'
                                            }}>
                                                <Box className="flex justify-between items-start mb-3">
                                                    <Skeleton variant="text" width="60%" height={28} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
                                                    <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
                                                </Box>
                                                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1, bgcolor: 'rgba(0,0,0,0.06)' }} />
                                                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2, bgcolor: 'rgba(0,0,0,0.06)' }} />
                                                <Box className="flex gap-2">
                                                    <Skeleton variant="rounded" width={60} height={20} sx={{ bgcolor: 'rgba(0,0,0,0.06)' }} />
                                                    <Skeleton variant="rounded" width={80} height={20} sx={{ bgcolor: 'rgba(0,0,0,0.06)' }} />
                                                </Box>
                                            </BlurCard>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        ) : (
                            <Box sx={{ position: 'relative' }}>
                                {/* Timeline line */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 6,
                                        top: 20,
                                        bottom: 20,
                                        width: 2,
                                        bgcolor: 'rgba(56, 142, 60, 0.2)',
                                        borderRadius: 1
                                    }}
                                />
                                
                                <Stack spacing={4}>
                                    {devLogs.map((log, index) => (
                                        <Zoom in={true} timeout={600 + index * 200} key={log.id}>
                                            <Box sx={{ 
                                                position: 'relative',
                                                display: 'flex',
                                                alignItems: 'flex-start'
                                            }}>
                                                {/* Time point */}
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        zIndex: 2,
                                                        width: 14,
                                                        height: 14,
                                                        bgcolor: index === 0 ? '#388E3C' : 'rgba(56, 142, 60, 0.6)',
                                                        borderRadius: '50%',
                                                        border: '3px solid rgba(255, 255, 255, 0.9)',
                                                        mr: 3,
                                                        mt: 1,
                                                        flexShrink: 0,
                                                        boxShadow: index === 0 ? '0 0 0 4px rgba(56, 142, 60, 0.2)' : 'none'
                                                    }}
                                                />
                                                
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    {/* Date, author and latest tag */}
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 2, 
                                                        mb: 2,
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <Typography variant="caption" sx={{ 
                                                            color: 'rgba(33, 37, 41, 0.7)',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                            px: 1.5,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            border: '1px solid rgba(33, 37, 41, 0.1)'
                                                        }}>
                                                            <CalendarIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                            {formatDate(log.date)}
                                                        </Typography>
                                                        
                                                        <Typography variant="caption" sx={{ 
                                                            color: 'rgba(108, 117, 125, 0.8)',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 500,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            bgcolor: 'rgba(248, 249, 250, 0.9)',
                                                            px: 1.5,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            border: '1px solid rgba(108, 117, 125, 0.2)'
                                                        }}>
                                                            <PersonIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                            {log.author}
                                                        </Typography>
                                                        
                                                        {index === 0 && (
                                                            <Chip 
                                                                label="最新"
                                                                size="small"
                                                                icon={<StarIcon sx={{ fontSize: 14 }} />}
                                                                sx={{ 
                                                                    bgcolor: '#ba68c8',
                                                                    color: 'white',
                                                                    fontSize: '0.75rem',
                                                                    height: 24,
                                                                    fontWeight: 'bold',
                                                                    boxShadow: '0 2px 8px rgba(186, 104, 200, 0.3)',
                                                                    '& .MuiChip-icon': {
                                                                        color: 'white'
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                    
                                                    <BlurCard
                                                        sx={{
                                                            p: 3,
                                                            borderRadius: 2,
                                                            bgcolor: index === 0 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                                                            border: index === 0 ? '2px solid rgba(186, 104, 200, 0.3)' : '1px solid rgba(255, 255, 255, 0.3)',
                                                            backdropFilter: 'blur(15px)',
                                                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-2px)',
                                                                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                                                                bgcolor: 'rgba(255, 255, 255, 0.8)'
                                                            }
                                                        }}
                                                    >
                                                        <Box className="flex justify-between items-start mb-3">
                                                            <Typography variant="h6" sx={{ 
                                                                color: 'rgba(33, 37, 41, 0.9)', 
                                                                fontWeight: 'bold', 
                                                                flex: 1, 
                                                                mr: 2
                                                            }}>
                                                                {log.title}
                                                            </Typography>
                                                            <Chip 
                                                                label={log.version} 
                                                                size="small" 
                                                                sx={{ 
                                                                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                                                                    color: '#1976d2',
                                                                    fontWeight: 'bold',
                                                                    border: '1px solid rgba(25, 118, 210, 0.2)',
                                                                    backdropFilter: 'blur(10px)'
                                                                }}
                                                            />
                                                        </Box>
                                                        
                                                        <Typography variant="body2" sx={{ 
                                                            color: 'rgba(108, 117, 125, 0.9)', 
                                                            mb: 3, 
                                                            lineHeight: 1.6 
                                                        }}>
                                                            {log.description || log.content}
                                                        </Typography>
                                                        
                                                        <Box className="flex gap-2 flex-wrap">
                                                            {log.tags.map((tag, tagIndex) => (
                                                                <Chip
                                                                    key={tagIndex}
                                                                    label={tag}
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                                        color: '#2e7d32',
                                                                        fontSize: '0.75rem',
                                                                        height: 24,
                                                                        border: '1px solid rgba(76, 175, 80, 0.2)',
                                                                        backdropFilter: 'blur(10px)',
                                                                        fontWeight: 500
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </BlurCard>
                                                </Box>
                                            </Box>
                                        </Zoom>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                </BlurCard>
            </Fade>

            {/* Friend links section - Only show when there's data */}
            {(!loading.friendLinks && friendLinks.length > 0) && (
                <Fade in={true} timeout={1000}>
                    <BlurCard sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ 
                            bgcolor: 'rgba(248, 249, 250, 0.8)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                            p: 3,
                            backdropFilter: 'blur(20px)'
                        }}>
                            <Box className="flex items-center justify-between">
                                <Box className="flex items-center">
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            bgcolor: '#F57C00',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 2,
                                            boxShadow: '0 4px 15px rgba(245, 124, 0, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.3)'
                                        }}
                                    >
                                        <LinkIcon sx={{ color: 'white', fontSize: 24 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ 
                                            color: 'rgba(33, 37, 41, 0.9)', 
                                            fontWeight: 'bold'
                                        }}>
                                            友情链接
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(108, 117, 125, 0.8)' }}>
                                            推荐的网站和资源
                                        </Typography>
                                    </Box>
                                </Box>
                                <Chip 
                                    label={`${friendLinks.length} 个链接`}
                                    size="small" 
                                    sx={{ 
                                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                                        color: '#e65100',
                                        border: '1px solid rgba(255, 152, 0, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {friendLinks.map((link, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={link.ID || link.id}>
                                        <Zoom in={true} timeout={800 + index * 100}>
                                            <BlurCard
                                                sx={{
                                                    p: 3,
                                                    height: '100%',
                                                    cursor: 'pointer',
                                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                                    bgcolor: 'rgba(255, 255, 255, 0.4)',
                                                    backdropFilter: 'blur(15px)',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                                                        bgcolor: 'rgba(255, 255, 255, 0.6)',
                                                        border: '1px solid rgba(25, 118, 210, 0.3)'
                                                    }
                                                }}
                                                onClick={() => handleLinkClick(link.URL || link.url)}
                                            >
                                                <Box className="flex items-center mb-3">
                                                    <Avatar
                                                        src={link.Avatar || link.avatar}
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                            mr: 2,
                                                            bgcolor: getCategoryColor(link.Category || link.category),
                                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        {getCategoryIcon(link.Category || link.category)}
                                                    </Avatar>
                                                    <Box className="flex-1">
                                                        <Typography variant="h6" sx={{ 
                                                            color: 'rgba(33, 37, 41, 0.9)', 
                                                            fontWeight: 'bold', 
                                                            fontSize: '1rem'
                                                        }}>
                                                            {link.Name || link.name}
                                                        </Typography>
                                                        <Chip 
                                                            label={link.Category || link.category} 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: 'rgba(0,0,0,0.05)',
                                                                color: getCategoryColor(link.Category || link.category),
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                                border: `1px solid ${getCategoryColor(link.Category || link.category)}33`,
                                                                backdropFilter: 'blur(10px)',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    </Box>
                                                    <IconButton 
                                                        size="small" 
                                                        sx={{ 
                                                            opacity: 0.7,
                                                            bgcolor: 'rgba(255, 255, 255, 0.5)',
                                                            backdropFilter: 'blur(10px)',
                                                            '&:hover': { 
                                                                opacity: 1,
                                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <OpenInNewIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: 'rgba(108, 117, 125, 0.9)', 
                                                        mb: 2, 
                                                        lineHeight: 1.5,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {link.Description || link.description}
                                                </Typography>
                                                
                                                <Box className="flex items-center justify-between">
                                                    <Typography variant="caption" sx={{ 
                                                        color: 'rgba(158, 158, 158, 0.8)',
                                                        fontWeight: 500
                                                    }}>
                                                        {(link.URL || link.url).replace(/^https?:\/\//, '').split('/')[0]}
                                                    </Typography>
                                                    {(link.featured || link.Featured) && (
                                                        <Chip 
                                                            label="推荐" 
                                                            size="small" 
                                                            sx={{ 
                                                                bgcolor: 'rgba(255, 193, 7, 0.1)',
                                                                color: '#f57c00',
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                                border: '1px solid rgba(255, 193, 7, 0.3)',
                                                                backdropFilter: 'blur(10px)',
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </BlurCard>
                                        </Zoom>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </BlurCard>
                </Fade>
            )}
        </Box>
    );
};

export default AboutPage;
