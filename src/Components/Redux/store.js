import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./clientSlice";

const store = configureStore({
  reducer: {
    client: clientReducer, // Register the client slice
  },
});

export default store;
