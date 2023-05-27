import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchValue: "",
};

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.searchValue = action.payload;
    },
    clearSearch: (state) => {
      state.searchValue = "";
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
