import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: JSON.parse(sessionStorage.getItem("user")) || null, 
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//       sessionStorage.setItem("user", JSON.stringify(action.payload)); 
//     },
//     clearUser: (state) => {
//       state.user = null;
//       sessionStorage.removeItem("user");
//     },
//   },
// });

// export const { setUser, clearUser } = authSlice.actions;
// export default authSlice.reducer;

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // ✅ changed
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // ✅ changed
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // ✅ changed
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
