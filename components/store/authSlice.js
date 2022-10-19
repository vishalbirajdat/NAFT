const { createSlice } = require('@reduxjs/toolkit');

const authSlice = createSlice({
    name: 'auth',
    initialState: 
        {
            provider : null,
            address : null  ,
        balance : null       
        }
    ,
    reducers: {
        changed(state, action) {
              state.provider = action.payload.provider,
              state.address = action.payload.address
            state.balance = action.payload.balance
        },

        balanceChanged(state, action){
            state.balance = action.payload
        }
      
    },
});

export const { changed, balanceChanged } = authSlice.actions;
export default authSlice.reducer;
