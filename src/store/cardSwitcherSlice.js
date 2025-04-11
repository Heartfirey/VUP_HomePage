import { createSlice } from '@reduxjs/toolkit';

const cardSwitcherSlice = createSlice({
    name: 'cardSwitcher',
    initialState: { activeCard: 0 },
    reducers: {
        switchToCard: (state, action) => {
            state.activeCard = action.payload;
        },
        toggleCard: (state) => {
            state.activeCard = state.activeCard === 0 ? 1 : 0;
        }
    }
});

export const { switchToCard, toggleCard } = cardSwitcherSlice.actions;
export default cardSwitcherSlice.reducer;
