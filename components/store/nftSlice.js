import { getAllNftsData,  getMyNftsData } from '../contract/contract/getFunctions';

import { STATUSES, TOASTS } from '../utils/constants';

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');



const nftSlice = createSlice({
    name: 'nfts',
    initialState: {
        AllNFT : {
            AllNFT: [],
            status: false,
        },

        MyNFT : {
            NFT : [],
            status: false,
        },


    },

    
    reducers: {
        addNewNFTs(state,action){
            state.AllNFT.AllNFT.push(action.payload);
        },
        addMyNFT(state, action) {
            state.MyNFT.NFT.push(action.payload)
        },

        moveMyNFT(state, action){
            return state.MyNFT.NFT.filter((nft) => nft.tokenId !== action.payload);
        },

        toastIsLoaded(state, action){
            state.AllNFT.status = false;
        },

   
    },
    extraReducers: (builder) => {
        builder

        // all NFTS
            .addCase(fetchAllNfts.pending, (state, action) => {
                state.AllNFT.status = STATUSES.LOADING;
            })
            .addCase(fetchAllNfts.fulfilled, (state, action) => {
                state.AllNFT.AllNFT = action.payload;
                state.AllNFT.status = STATUSES.IDLE;
            })
            .addCase(fetchAllNfts.rejected, (state, action) => {
                state.AllNFT.status = STATUSES.ERROR;
            })

            // myNFTS

            .addCase(fetchMyNfts.pending, (state, action) => {
                state.MyNFT.status = STATUSES.LOADING;
             })
            .addCase(fetchMyNfts.fulfilled, (state, action) => {
                state.MyNFT.NFT = action.payload;
                state.MyNFT.status = STATUSES.IDLE;
        })
            .addCase(fetchMyNfts.rejected, (state, action) => {
                state.MyNFT.status = STATUSES.ERROR;
        });
    },
});

export const { addNewNFTs, addMyNFT, moveMyNFT, toastIsLoaded  } = nftSlice.actions;
export default nftSlice.reducer;

// // Thunks
export const fetchAllNfts = createAsyncThunk('allnaft/fetch', async () => {
    const data = await getAllNftsData();
    return data;
});

export const fetchMyNfts = createAsyncThunk('mynaft/fetch', async (provider) => {
    const data = await getMyNftsData(provider);
    return data;
});

