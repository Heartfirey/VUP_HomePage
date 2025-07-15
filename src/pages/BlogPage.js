import React, { useState, useEffect } from 'react';
import config from '../config';
import { 
    Box, 
    Typography, 
    Chip,
    Avatar,
    Grid,
    Button,
    IconButton,
    Skeleton,
    useTheme,
    useMediaQuery,
    Fade,
    Zoom,
    Stack,
    Dialog,
    DialogContent,
    Pagination
} from '@mui/material';
import { 
    PushPin as PinIcon,
    Schedule as TimeIcon,
    Image as ImageIcon,
    Close as CloseIcon,
    OpenInNew as OpenInNewIcon,
    PlayArrow as PlayArrowIcon,
    Favorite as FavoriteIcon,
    LiveTv as LiveTvIcon,
    MusicNote as MusicNoteIcon,
    Feedback as FeedbackIcon,
    Share as ShareIcon
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { RawBlurCardNoAnimate as BlurCard } from '../components/RawBlurCard';
import { getBlogPosts, getBlogPost } from '../services/API/backend/blogApi';

const BlogPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(false);

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
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await getBlogPosts({ page, pageSize: 5 });
            if (response.code === 200) {
                setPosts(response.data.posts);
                setTotalPages(Math.ceil(response.data.total / response.data.pageSize));
                setHasMore(response.data.hasMore);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
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
        } else if (diffInHours < 24 * 7) {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}天前`;
        } else {
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setImageDialogOpen(true);
    };

    const handleButtonClick = async (button, postId) => {
        if (button.url.startsWith('mailto:')) {
            window.location.href = button.url;
        } else if (button.url.startsWith('http')) {
            window.open(button.url, '_blank', 'noopener,noreferrer');
        } else {
            // 内部路由
            window.location.href = button.url;
        }
    };

    const getButtonIcon = (iconName) => {
        const iconMap = {
            'play_arrow': <PlayArrowIcon />,
            'favorite': <FavoriteIcon />,
            'live_tv': <LiveTvIcon />,
            'music_note': <MusicNoteIcon />,
            'feedback': <FeedbackIcon />,
            'share': <ShareIcon />
        };
        return iconMap[iconName] || <OpenInNewIcon />;
    };

    const getButtonColor = (type) => {
        const colorMap = {
            'primary': '#2196F3',
            'secondary': '#9C27B0', 
            'success': '#4CAF50',
            'warning': '#FF9800',
            'error': '#F44336'
        };
        return colorMap[type] || '#2196F3';
    };

    const renderContent = (post) => {
        if (post.contentType === 'html') {
            return (
                <div 
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    style={{
                        lineHeight: 1.6,
                        color: 'rgba(33, 37, 41, 0.9)'
                    }}
                />
            );
        } else if (post.contentType === 'markdown') {
            return (
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                        h1: ({ children }) => (
                            <Typography variant="h4" sx={{ 
                                color: 'rgba(33, 37, 41, 0.9)', 
                                mb: 2, 
                                fontWeight: 'bold'
                            }}>
                                {children}
                            </Typography>
                        ),
                        h2: ({ children }) => (
                            <Typography variant="h5" sx={{ 
                                color: 'rgba(33, 37, 41, 0.9)', 
                                mb: 2, 
                                mt: 3,
                                fontWeight: 'bold'
                            }}>
                                {children}
                            </Typography>
                        ),
                        h3: ({ children }) => (
                            <Typography variant="h6" sx={{ 
                                color: 'rgba(33, 37, 41, 0.9)', 
                                mb: 1.5, 
                                mt: 2,
                                fontWeight: 'bold'
                            }}>
                                {children}
                            </Typography>
                        ),
                        p: ({ children }) => (
                            <Typography variant="body1" sx={{ 
                                color: 'rgba(108, 117, 125, 0.9)', 
                                mb: 2,
                                lineHeight: 1.6
                            }}>
                                {children}
                            </Typography>
                        ),
                        ul: ({ children }) => (
                            <Box component="ul" sx={{ color: 'rgba(108, 117, 125, 0.9)', pl: 3, mb: 2 }}>
                                {children}
                            </Box>
                        ),
                        li: ({ children }) => (
                            <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
                                {children}
                            </Typography>
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
                    {post.content}
                </ReactMarkdown>
            );
        } else {
            return (
                <Typography variant="body1" sx={{ 
                    color: 'rgba(108, 117, 125, 0.9)', 
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                }}>
                    {post.content}
                </Typography>
            );
        }
    };

    return (
        <Box className="space-y-6">
            {/* Page title */}
            <Fade in={true} timeout={600}>
                <BlurCard sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
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
                                        bgcolor: '#E91E63',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 2,
                                        boxShadow: '0 4px 15px rgba(233, 30, 99, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)'
                                    }}
                                >
                                    <ShareIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ 
                                        color: 'rgba(33, 37, 41, 0.9)', 
                                        fontWeight: 'bold'
                                    }}>
                                        动态公告
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(108, 117, 125, 0.8)' }}>
                                        最新动态和重要公告
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip 
                                label={`${posts.length} 条动态`}
                                size="small" 
                                sx={{ 
                                    bgcolor: 'rgba(233, 30, 99, 0.1)',
                                    color: '#C2185B',
                                    border: '1px solid rgba(233, 30, 99, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                    </Box>
                </BlurCard>
            </Fade>

            {/* Post list */}
            {loading ? (
                <Stack spacing={3}>
                    {[1, 2, 3].map((item) => (
                        <BlurCard key={item} sx={{ borderRadius: 3, p: 3 }}>
                            <Box className="flex items-start space-x-3">
                                <Skeleton variant="circular" width={48} height={48} />
                                <Box className="flex-1">
                                    <Skeleton variant="text" width="60%" height={32} />
                                    <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                                    <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 2 }} />
                                </Box>
                            </Box>
                        </BlurCard>
                    ))}
                </Stack>
            ) : (
                <Stack spacing={4}>
                    {posts.map((post, index) => (
                        <Fade in={true} timeout={800 + index * 200} key={post.id}>
                            <Box
                                sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    border: post.isPinned ? '2px solid rgba(233, 30, 99, 0.4)' : '1px solid rgba(255, 255, 255, 0.8)',
                                    bgcolor: post.isPinned ? 
                                        'linear-gradient(135deg, rgba(255, 245, 248, 0.95) 0%, rgba(255, 250, 252, 0.9) 100%)' :
                                        'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%)',
                                    background: post.isPinned ? 
                                        'linear-gradient(135deg, rgba(255, 245, 248, 0.95) 0%, rgba(255, 250, 252, 0.9) 100%)' :
                                        'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.9) 100%)',
                                    boxShadow: post.isPinned ? 
                                        '0 12px 40px rgba(233, 30, 99, 0.15), 0 4px 16px rgba(233, 30, 99, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)' : 
                                        '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: post.isPinned ?
                                            'linear-gradient(135deg, rgba(233, 30, 99, 0.02) 0%, rgba(233, 30, 99, 0.01) 50%, rgba(255, 255, 255, 0.02) 100%)' :
                                            'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
                                        borderRadius: 4,
                                        pointerEvents: 'none',
                                        zIndex: 1
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-4px) scale(1.02)',
                                        boxShadow: post.isPinned ? 
                                            '0 20px 60px rgba(233, 30, 99, 0.25), 0 8px 24px rgba(233, 30, 99, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)' : 
                                            '0 16px 48px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1)',
                                        border: post.isPinned ? '2px solid rgba(233, 30, 99, 0.6)' : '1px solid rgba(255, 255, 255, 1)'
                                    }
                                }}
                            >
                                {/* Post header */}
                                <Box sx={{ p: 3, pb: 2, position: 'relative', zIndex: 2 }}>
                                    <Box className="flex items-start justify-between mb-3">
                                        <Box className="flex items-center">
                                            <Avatar
                                                src={getAvatarSrc(post.author)}
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    mr: 2,
                                                    bgcolor: '#F5F5F5', // 非常淡的灰色背景
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {!getAvatarSrc(post.author) && post.author.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Box className="flex items-center gap-2">
                                                    <Typography variant="h6" sx={{ 
                                                        color: 'rgba(33, 37, 41, 0.9)', 
                                                        fontWeight: 'bold',
                                                        fontSize: '1.1rem'
                                                    }}>
                                                        {post.author}
                                                    </Typography>
                                                    {post.isPinned && (
                                                        <Chip
                                                            icon={<PinIcon sx={{ fontSize: 14 }} />}
                                                            label="置顶"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#E91E63',
                                                                color: 'white',
                                                                fontSize: '0.7rem',
                                                                height: 22,
                                                                fontWeight: 'bold',
                                                                '& .MuiChip-icon': {
                                                                    color: 'white'
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Box className="flex items-center gap-3 mt-1">
                                                    <Typography variant="caption" sx={{ 
                                                        color: 'rgba(108, 117, 125, 0.8)',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        <TimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                        {formatDate(post.publishTime)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Post title */}
                                    <Typography variant="h5" sx={{ 
                                        color: 'rgba(33, 37, 41, 0.9)', 
                                        fontWeight: 'bold',
                                        mb: 2,
                                        lineHeight: 1.3
                                    }}>
                                        {post.title}
                                    </Typography>

                                    {/* Post content */}
                                    <Box sx={{ mb: 3 }}>
                                        {renderContent(post)}
                                    </Box>

                                    {/* Image display */}
                                    {post.images && post.images.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Grid container spacing={2}>
                                                {post.images.map((image, imgIndex) => (
                                                    <Grid 
                                                        item 
                                                        xs={post.images.length === 1 ? 12 : 6} 
                                                        sm={post.images.length === 1 ? 8 : 4}
                                                        key={image.id}
                                                    >
                                                        <Zoom in={true} timeout={1000 + imgIndex * 100}>
                                                            <Box
                                                                sx={{
                                                                    position: 'relative',
                                                                    borderRadius: 2,
                                                                    overflow: 'hidden',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.3s ease',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.02)',
                                                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                                                                    }
                                                                }}
                                                                onClick={() => handleImageClick(image)}
                                                            >
                                                                <img
                                                                    src={image.thumbnail || image.url}
                                                                    alt={image.alt}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: post.images.length === 1 ? '300px' : '200px',
                                                                        objectFit: 'cover',
                                                                        borderRadius: '8px'
                                                                    }}
                                                                />
                                                                <Box
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        top: 8,
                                                                        right: 8,
                                                                        bgcolor: 'rgba(0,0,0,0.6)',
                                                                        borderRadius: 1,
                                                                        p: 0.5,
                                                                        display: 'flex',
                                                                        alignItems: 'center'
                                                                    }}
                                                                >
                                                                    <ImageIcon sx={{ color: 'white', fontSize: 16 }} />
                                                                </Box>
                                                            </Box>
                                                        </Zoom>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}

                                    {/* Tags */}
                                    {processTags(post.tags).length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Box className="flex gap-2 flex-wrap">
                                                {processTags(post.tags).map((tag, tagIndex) => (
                                                    <Chip
                                                        key={tagIndex}
                                                        label={`#${tag}`}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(233, 30, 99, 0.1)',
                                                            color: '#C2185B',
                                                            fontSize: '0.75rem',
                                                            height: 24,
                                                            border: '1px solid rgba(233, 30, 99, 0.2)',
                                                            backdropFilter: 'blur(10px)',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Custom buttons */}
                                    {post.customButtons && post.customButtons.length > 0 && (
                                        <Box className="flex gap-2 flex-wrap">
                                            {post.customButtons.map((button) => (
                                                <Button
                                                    key={button.id}
                                                    startIcon={getButtonIcon(button.icon)}
                                                    variant="contained"
                                                    size="medium"
                                                    onClick={() => handleButtonClick(button, post.id)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        px: 3,
                                                        py: 1,
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        bgcolor: getButtonColor(button.type),
                                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                                        backdropFilter: 'blur(10px)',
                                                        boxShadow: `0 4px 16px ${getButtonColor(button.type)}40`,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            bgcolor: getButtonColor(button.type),
                                                            filter: 'brightness(0.9)',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: `0 6px 24px ${getButtonColor(button.type)}60`
                                                        }
                                                    }}
                                                >
                                                    {button.text}
                                                </Button>
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Fade>
                    ))}
                </Stack>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                                }
                            }
                        }}
                    />
                </Box>
            )}

            {/* Image preview dialog */}
            <Dialog
                open={imageDialogOpen}
                onClose={() => setImageDialogOpen(false)}
                maxWidth="lg"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        bgcolor: 'transparent',
                        boxShadow: 'none',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogContent sx={{ p: 1, position: 'relative' }}>
                    <IconButton
                        onClick={() => setImageDialogOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1,
                            bgcolor: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.8)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {selectedImage && (
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.alt}
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '90vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BlogPage;
