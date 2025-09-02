import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./clientSlice";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    client: clientReducer, // Register the client slice
    auth: authReducer, // Register the auth slice
  },
});

export default store;
