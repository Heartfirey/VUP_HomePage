import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const FrostedButtonContainer = styled(Button)(({ theme }) => ({
    backgroundColor: '#F2F2F7',
    border: '0px',
    borderRadius: '12px',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 500,
    color: '#000',
    '&:hover': {
        backgroundColor: '#E5E5EA',
        border: '0px',
    },
    '&:active': {
        backgroundColor: '#D1D1D6',
        border: '0px',
    },
}));

export default function FrostedButton({ children, ...props }) {
    return (
        <FrostedButtonContainer {...props}>
            {children}
        </FrostedButtonContainer>
    );
}
