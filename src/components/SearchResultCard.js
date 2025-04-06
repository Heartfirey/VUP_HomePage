import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { setPersistentSearch, fetchSongsById, fetchSongsByType, incrementPage } from '../store/songSlice';
import { motion, AnimatePresence } from 'framer-motion';
import GradientText from '../animations/GradientText';
import CopyToClipboardSnackbar from '../services/copyUtils';

const FrostedTableContainer = styled(TableContainer)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    border: '1px solid rgba(209, 209, 214, 0.5)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    // overflow: 'hidden',
    overflowX: 'auto',
}));

const FrostedTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '16px',
    borderBottom: '1px solid rgba(209, 209, 214, 0.5)',
    color: theme.palette.text.primary,
}));

const FrostedTableHeadCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 900,
    fontSize: '20px',
    alignContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: theme.palette.text.primary,
    borderBottom: '1px solid rgba(209, 209, 214, 0.5)',
}));

const ResultTable = () => {
    const dispatch = useDispatch();
    const { persistentMode, persistentKeyword, pageNum, pageSize, songs, loading } = useSelector(state => state.song);
    const copyRef = useRef();
    const observer = useRef();

    useEffect(() => {
        if (!persistentKeyword) {
            const defaultType = "";  // 默认歌单类型
            dispatch(setPersistentSearch({ mode: "type", keyword: defaultType }));
            dispatch(fetchSongsByType({ songType: defaultType, pageNum: 1, pageSize }));
        }
    }, [persistentKeyword, dispatch, pageSize]);

    const lastSongElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                dispatch(incrementPage());
                if (persistentMode === "type") {
                    dispatch(fetchSongsByType({ songType: persistentKeyword, pageNum: pageNum + 1, pageSize }));
                } else if (persistentMode === "id") {
                    dispatch(fetchSongsById({ songId: persistentKeyword, pageNum: pageNum + 1, pageSize }));
                }
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, dispatch, persistentMode, persistentKeyword, pageNum, pageSize]);

    const handleRowClick = (songName) => {
        if (copyRef.current) {
            copyRef.current.copy(songName);
        }
    };

    const gradientSchemeA = ["#ffaa40", "#E80505", "#FDD819"];
    const gradientSchemeB = ["#FF6FD8", "#3813C2", "#9708CC"];

    const renderCell = (content, forceGradient = false, gradientColors = gradientSchemeA) => {
        return forceGradient ? (
            <GradientText
                colors={gradientColors}
                animationSpeed={3}
                showBorder={false}
                className="custom-class"
            >
                {content}
            </GradientText>
        ) : (
            content
        );
    };
    return (
        <>
            <FrostedTableContainer component={Paper}>
                <Table style={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            <FrostedTableHeadCell sx={{ maxWidth: '150px' }}>名称</FrostedTableHeadCell>
                            <FrostedTableHeadCell>歌手</FrostedTableHeadCell>
                            <FrostedTableHeadCell>类型</FrostedTableHeadCell>
                            <FrostedTableHeadCell>语言</FrostedTableHeadCell>
                            <FrostedTableHeadCell>SC</FrostedTableHeadCell>
                            <FrostedTableHeadCell>备注</FrostedTableHeadCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <AnimatePresence>
                            {songs.map((song, index) => {
                                const hasSC = song.remarks && song.remarks.trim() !== "";
                                const rowHasExclusive = song.info && song.info.toString().includes("专属");

                                const rowProps = songs.length === index + 1 ? { ref: lastSongElementRef } : {};

                                return (
                                    <motion.tr
                                        key={song.id}
                                        {...rowProps}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        whileTap={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
                                        onClick={() => handleRowClick(song.songName)}
                                    >
                                        {/* <TableRow onClick={() => handleRowClick(song.songName)}> */}
                                        {rowHasExclusive ? (
                                            <>
                                                <FrostedTableCell sx={{ maxWidth: '150px' }}>{renderCell(song.songName, true, gradientSchemeB)}</FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.songOwner, true, gradientSchemeB)}</FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.songType, true, gradientSchemeB)}</FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.language, true, gradientSchemeB)}</FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.remarks, true, gradientSchemeB)}</FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.info, true, gradientSchemeB)}</FrostedTableCell>
                                            </>
                                        ) : hasSC ? (
                                            <>
                                                <FrostedTableCell sx={{ maxWidth: '150px' }}>{renderCell(song.songName, true, gradientSchemeA)}</FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.songOwner, true, gradientSchemeA)}</FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.songType, true, gradientSchemeA)}</FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.language, true, gradientSchemeA)}</FrostedTableCell>
                                                <FrostedTableCell>
                                                    <Chip
                                                        label={song.remarks}
                                                        sx={{
                                                            backgroundColor: "#FFD700",
                                                            border: "4px solid #FFAB00",
                                                            fontWeight: "bold",
                                                            color: "#000",
                                                        }}
                                                    />
                                                </FrostedTableCell>
                                                <FrostedTableCell>{renderCell(song.info, true, gradientSchemeA)}</FrostedTableCell>
                                            </>
                                        ) : (
                                            <>
                                                <FrostedTableCell sx={{ maxWidth: '150px' }}>{song.songName}</FrostedTableCell>
                                                <FrostedTableCell>{song.songOwner}</FrostedTableCell>
                                                <FrostedTableCell>{song.songType}</FrostedTableCell>
                                                <FrostedTableCell>{song.language}</FrostedTableCell>
                                                <FrostedTableCell>{song.remarks}</FrostedTableCell>
                                                <FrostedTableCell>{song.info}</FrostedTableCell>
                                            </>
                                        )}
                                        {/* </TableRow> */}
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </TableBody>
                </Table>
                {loading && (
                    <Box display="flex" justifyContent="center" mt={2} mb={2}>
                        <CircularProgress size={32} color="primary" />
                    </Box>
                )}
            </FrostedTableContainer>
            <CopyToClipboardSnackbar ref={copyRef} />
        </>
    );
};

export default ResultTable;
