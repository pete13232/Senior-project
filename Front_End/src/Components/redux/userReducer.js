import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userObject: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userObject = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
