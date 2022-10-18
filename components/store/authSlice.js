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
      
    },
});

export const { changed } = authSlice.actions;
export default authSlice.reducer;
