import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


const GlassCard = styled(Card)(({ theme }) => ({
    backdropFilter: 'blur(24px)',
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    boxShadow: (theme.vars || theme).shadows[1],
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    //   padding: theme.spacing(2),
}));

export default function BlurCard({ children, ...other }) {
    return (
        <GlassCard {...other}>
            <CardContent className='p-0 m-0'>
                {children}
            </CardContent>
        </GlassCard>
    );
}
