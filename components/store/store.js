import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import nftReducer from './nftSlice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        nfts: nftReducer,
    },
});

export default store;
