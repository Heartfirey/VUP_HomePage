import React, { useState, useEffect, useRef } from 'react';
import config from '../config';
import { 
    Box, 
    Typography, 
    Chip,
    Avatar,
    Button,
    IconButton,
    Fade
} from '@mui/material';
import { 
    PushPin as PinIcon,
    Close as CloseIcon,
    Schedule as TimeIcon,
    PlayArrow as PlayArrowIcon,
    Favorite as FavoriteIcon,
    LiveTv as LiveTvIcon,
    MusicNote as MusicNoteIcon,
    Feedback as FeedbackIcon,
    OpenInNew as OpenInNewIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { RawBlurCardNoAnimate as BlurCard } from './RawBlurCard';
import { getHomepagePosts } from '../services/API/backend/blogApi';

const HomepagePostCard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visiblePosts, setVisiblePosts] = useState({});
    const scrollContainerRef = useRef(null);
    const [currentScroll, setCurrentScroll] = useState(0);

    // 获取头像的函数
    const getAvatarSrc = (author) => {
        if (author === config.anchorInfo.name) {
            return require(`../assets/${config.siteSettings.avatarFile}`);
        }
        return null; // 返回null时使用默认的文字头像
    };

    // 处理标签的函数
    const processTags = (tags) => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        if (typeof tags === 'string') {
            return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
        return [];
    };

    useEffect(() => {
        fetchHomepagePosts();
    }, []);

    // 监听可见卡片变化，确保索引在有效范围内
    useEffect(() => {
        const visiblePostsList = posts.filter(post => visiblePosts[post.id]);
        const currentIndex = Math.round(currentScroll);
        
        if (visiblePostsList.length > 0 && currentIndex >= visiblePostsList.length) {
            setCurrentScroll(0);
        }
    }, [visiblePosts, currentScroll, posts]);

    // 自动轮播逻辑
    useEffect(() => {
        const visiblePostsList = posts.filter(post => visiblePosts[post.id]);
        if (visiblePostsList.length > 1) {
            const interval = setInterval(() => {
                setCurrentScroll(prev => {
                    const currentIndex = Math.round(prev);
                    const maxIndex = visiblePostsList.length - 1;
                    
                    // 确保当前索引在有效范围内
                    if (currentIndex >= maxIndex) {
                        return 0; // 循环到第一个
                    } else {
                        return currentIndex + 1;
                    }
                });
            }, 5000); // 5秒自动切换

            return () => clearInterval(interval);
        }
    }, [posts, visiblePosts]);

    const getLayoutMode = () => {
        const visiblePostsList = posts.filter(post => visiblePosts[post.id]);
        // 强制使用单卡片模式，让每个卡片占满宽度
        return 'single';
    };

    const fetchHomepagePosts = async () => {
        try {
            const response = await getHomepagePosts();
            if (response.code === 200) {
                const homepagePosts = response.data.posts;
                setPosts(homepagePosts);
                
                // 初始化可见性状态
                const initialVisibility = {};
                homepagePosts.forEach(post => {
                    initialVisibility[post.id] = true;
                });
                setVisiblePosts(initialVisibility);
            }
        } catch (error) {
            console.error('Error fetching homepage posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            const diffInMinutes = Math.floor((now - date) / (1000 * 60));
            return `${diffInMinutes}分钟前`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}小时前`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}天前`;
        }
    };

    const handleCardClick = async (post) => {
        try {
            if (post.customButtons?.[0]?.url) {
                window.open(post.customButtons[0].url, '_blank');
            }
        } catch (error) {
            console.error('Error handling card click:', error);
        }
    };

    const handleCloseCard = (postId, event) => {
        event.stopPropagation();
        setVisiblePosts(prev => {
            const newVisiblePosts = {
                ...prev,
                [postId]: false
            };
            
            // 更新后检查当前显示的卡片
            const newVisiblePostsList = posts.filter(post => newVisiblePosts[post.id]);
            
            // 如果当前索引超出了可见卡片的范围，重置到第一个
            if (newVisiblePostsList.length > 0) {
                const currentIndex = Math.round(currentScroll);
                if (currentIndex >= newVisiblePostsList.length) {
                    setCurrentScroll(0);
                }
            }
            
            return newVisiblePosts;
        });
    };

    const restoreAllCards = () => {
        const initialVisibility = {};
        posts.forEach(post => {
            initialVisibility[post.id] = true;
        });
        setVisiblePosts(initialVisibility);
        setCurrentScroll(0);
    };

    const scrollLeft = () => {
        const visiblePostsList = posts.filter(post => visiblePosts[post.id]);
        if (visiblePostsList.length === 0) return;
        
        const currentIndex = Math.round(currentScroll);
        const newIndex = Math.max(currentIndex - 1, 0);
        setCurrentScroll(newIndex);
    };

    const scrollRight = () => {
        const visiblePostsList = posts.filter(post => visiblePosts[post.id]);
        if (visiblePostsList.length === 0) return;
        
        const currentIndex = Math.round(currentScroll);
        const maxIndex = visiblePostsList.length - 1;
        const newIndex = Math.min(currentIndex + 1, maxIndex);
        setCurrentScroll(newIndex);
    };

    const getTypeIcon = (tag) => {
        if (tag?.includes('直播')) return <LiveTvIcon sx={{ fontSize: 14, mr: 0.5 }} />;
        if (tag?.includes('音乐') || tag?.includes('歌')) return <MusicNoteIcon sx={{ fontSize: 14, mr: 0.5 }} />;
        return <FeedbackIcon sx={{ fontSize: 14, mr: 0.5 }} />;
    };

    const getTypeColor = (tag) => {
        if (tag?.includes('直播')) return '#F06292'; // 粉红色
        if (tag?.includes('音乐') || tag?.includes('歌')) return '#81C784'; // 绿色
        return '#FFB74D'; // 橙色
    };

    const renderContent = (content) => {
        if (!content) return null;
        
        // 检查是否为 HTML 内容
        const isHTML = content.includes('<div') || content.includes('<h2>') || content.includes('<ul>');
        
        if (isHTML) {
            // HTML 内容使用 ReactMarkdown 渲染
            return (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                        div: ({ children }) => <Box sx={{ mb: 1 }}>{children}</Box>,
                        p: ({ children }) => (
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ mb: 1, lineHeight: 1.6 }}
                            >
                                {children}
                            </Typography>
                        ),
                        h1: ({ children }) => <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>{children}</Typography>,
                        h2: ({ children }) => <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>{children}</Typography>,
                        h3: ({ children }) => <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>{children}</Typography>,
                        ul: ({ children }) => <Box component="ul" sx={{ pl: 2, mb: 1 }}>{children}</Box>,
                        ol: ({ children }) => <Box component="ol" sx={{ pl: 2, mb: 1 }}>{children}</Box>,
                        li: ({ children }) => <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{children}</Typography>,
                        strong: ({ children }) => <Typography component="span" sx={{ fontWeight: 'bold' }}>{children}</Typography>,
                        em: ({ children }) => <Typography component="span" sx={{ fontStyle: 'italic' }}>{children}</Typography>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            );
        } else {
            // Markdown 或纯文本内容
            return (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        p: ({ children }) => (
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ mb: 1, lineHeight: 1.6 }}
                            >
                                {children}
                            </Typography>
                        ),
                        h1: ({ children }) => <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>{children}</Typography>,
                        h2: ({ children }) => <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>{children}</Typography>,
                        h3: ({ children }) => <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>{children}</Typography>,
                        ul: ({ children }) => <Box component="ul" sx={{ pl: 2, mb: 1 }}>{children}</Box>,
                        ol: ({ children }) => <Box component="ol" sx={{ pl: 2, mb: 1 }}>{children}</Box>,
                        li: ({ children }) => <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{children}</Typography>,
                        strong: ({ children }) => <Typography component="span" sx={{ fontWeight: 'bold' }}>{children}</Typography>,
                        em: ({ children }) => <Typography component="span" sx={{ fontStyle: 'italic' }}>{children}</Typography>,
                        code: ({ children }) => (
                            <Typography 
                                component="code" 
                                sx={{ 
                                    bgcolor: 'rgba(255, 255, 255, 0.1)', 
                                    px: 0.5, 
                                    py: 0.25, 
                                    borderRadius: 0.5,
                                    fontFamily: 'monospace',
                                    fontSize: '0.875em'
                                }}
                            >
                                {children}
                            </Typography>
                        ),
                        blockquote: ({ children }) => (
                            <Box 
                                sx={{ 
                                    borderLeft: '4px solid',
                                    borderLeftColor: 'primary.main',
                                    pl: 2,
                                    py: 1,
                                    mb: 1,
                                    bgcolor: 'rgba(255, 255, 255, 0.05)'
                                }}
                            >
                                {children}
                            </Box>
                        )
                    }}
                >
                    {content}
                </ReactMarkdown>
            );
        }
    };

    // 获取当前可见的动态
    const visiblePostsList = posts.filter(post => visiblePosts[post.id]);

    if (loading || visiblePostsList.length === 0) {
        return null;
    }

    const layoutMode = getLayoutMode();

    return (
        <Box sx={{ 
            position: 'relative',
            overflow: 'visible'
        }}>
            {/* Card display - Only show current index card */}
            {visiblePostsList.length > 0 && (
                <Fade key={visiblePostsList[Math.round(currentScroll)]?.id || 'empty'} in={true} timeout={500}>
                    <Box
                        sx={{
                            width: '100%',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)'
                            }
                        }}
                        onClick={() => {
                            const currentPost = visiblePostsList[Math.round(currentScroll)];
                            if (currentPost) {
                                handleCardClick(currentPost);
                            }
                        }}
                    >
                        <BlurCard
                            sx={{
                                p: 3,
                                height: '450px', // 固定卡片总高度
                                maxHeight: '450px',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {(() => {
                                const currentIndex = Math.round(currentScroll);
                                const post = visiblePostsList[currentIndex];
                                
                                // 如果索引越界或没有卡片，显示空状态
                                if (!post || currentIndex >= visiblePostsList.length) {
                                    return (
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            height: '100%',
                                            color: 'text.secondary'
                                        }}>
                                            <Typography variant="body2">
                                                暂无动态内容
                                            </Typography>
                                        </Box>
                                    );
                                }
                                
                                return (
                                    <>
                                        {/* Close button */}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleCloseCard(post.id, e)}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 255, 255, 1)',
                                                },
                                                width: 28,
                                                height: 28
                                            }}
                                        >
                                            <CloseIcon sx={{ fontSize: 16 }} />
                                        </IconButton>

                                        {/* Card header */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar
                                                src={getAvatarSrc(post.author)}
                                                sx={{ 
                                                    width: 32, 
                                                    height: 32, 
                                                    mr: 1.5,
                                                    bgcolor: '#F5F5F5' // 非常淡的灰色背景
                                                }}
                                            >
                                                {!getAvatarSrc(post.author) && (post.author || '凛音').charAt(0)}
                                            </Avatar>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                                    {post.author || '凛音'}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <TimeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(post.publishTime)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {post.isPinned && (
                                                <PinIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                                            )}
                                        </Box>

                                        {/* Title and tags */}
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                {processTags(post.tags).slice(0, 2).map((tag, tagIndex) => (
                                                    <Chip
                                                        key={tagIndex}
                                                        icon={getTypeIcon(tag)}
                                                        label={tag}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getTypeColor(tag),
                                                            color: 'white',
                                                            fontWeight: 500,
                                                            '& .MuiChip-icon': {
                                                                color: 'white'
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    mb: 1,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    lineHeight: 1.3
                                                }}
                                            >
                                                {post.title}
                                            </Typography>
                                        </Box>

                                        {/* Content area */}
                                        <Box 
                                            sx={{ 
                                                flexGrow: 1, 
                                                overflow: 'auto',
                                                mb: 2,
                                                pr: 1,
                                                maxHeight: '200px', // 限制内容区域最大高度
                                                '&::-webkit-scrollbar': {
                                                    width: '4px'
                                                },
                                                '&::-webkit-scrollbar-track': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '2px'
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                                                    borderRadius: '2px',
                                                    '&:hover': {
                                                        bgcolor: 'rgba(255, 255, 255, 0.5)'
                                                    }
                                                }
                                            }}
                                        >
                                            {/* Image */}
                                            {post.images?.[0] && (
                                                <Box
                                                    component="img"
                                                    src={post.images[0].thumbnail || post.images[0].url}
                                                    alt={post.images[0].alt}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100px', // 减小图片高度以适应限制的内容区域
                                                        objectFit: 'cover',
                                                        borderRadius: 1,
                                                        mb: 2
                                                    }}
                                                />
                                            )}
                                            
                                            {/* Content */}
                                            {renderContent(post.content)}
                                        </Box>

                                        {/* Bottom info */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            pt: 1,
                                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                {/* Removed view count display */}
                                            </Box>
                                            
                                            {/* Custom buttons */}
                                            {post.customButtons?.[0] && (
                                                <Button
                                                    size="small"
                                                    startIcon={
                                                        post.customButtons[0].icon === 'play_arrow' ? <PlayArrowIcon /> : 
                                                        post.customButtons[0].icon === 'favorite' ? <FavoriteIcon /> :
                                                        post.customButtons[0].icon === 'live_tv' ? <LiveTvIcon /> :
                                                        post.customButtons[0].icon === 'music_note' ? <MusicNoteIcon /> :
                                                        <OpenInNewIcon />
                                                    }
                                                    sx={{
                                                        minWidth: 'auto',
                                                        color: 'primary.main',
                                                        '&:hover': {
                                                            bgcolor: 'rgba(25, 118, 210, 0.04)'
                                                        }
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCardClick(post);
                                                    }}
                                                >
                                                    {post.customButtons[0].text}
                                                </Button>
                                            )}
                                        </Box>
                                    </>
                                );
                            })()}
                        </BlurCard>
                    </Box>
                </Fade>
            )}

            {/* Page indicator */}
            {visiblePostsList.length > 1 && (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 1, 
                    mt: 3,
                    mb: 1
                }}>
                    {visiblePostsList.map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: Math.round(currentScroll) === index ? 24 : 8,
                                height: 8,
                                borderRadius: 4,
                                bgcolor: Math.round(currentScroll) === index ? 'primary.main' : 'rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                backdropFilter: 'blur(10px)',
                                border: Math.round(currentScroll) === index 
                                    ? '1px solid rgba(255, 255, 255, 0.5)' 
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: Math.round(currentScroll) === index 
                                    ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
                                    : '0 2px 6px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    bgcolor: Math.round(currentScroll) === index ? 'primary.dark' : 'rgba(255, 255, 255, 0.5)',
                                    transform: 'scale(1.1)',
                                    boxShadow: Math.round(currentScroll) === index 
                                        ? '0 6px 16px rgba(0, 0, 0, 0.25)' 
                                        : '0 4px 10px rgba(0, 0, 0, 0.15)',
                                },
                                '&:active': {
                                    transform: 'scale(0.95)',
                                    transition: 'all 0.1s ease',
                                }
                            }}
                            onClick={() => {
                                if (index < visiblePostsList.length) {
                                    setCurrentScroll(index);
                                }
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default HomepagePostCard;
