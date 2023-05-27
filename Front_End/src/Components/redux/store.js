import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import searchReducer from "./searchReducer";
const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
});

export default store;
