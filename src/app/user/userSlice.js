import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
  address: '',
  web3: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateAddress: (state, action) => {
      console.log("payload", action.payload)
        state.address = action.payload;
    },
    updateWeb3: (state, action) => {
      console.log("payload", action.payload)
        state.web3 = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateAddress, updateWeb3 } = userSlice.actions

export default userSlice.reducer