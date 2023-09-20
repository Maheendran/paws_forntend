import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import jwtDecode from "jwt-decode";

export interface AdminData {
  email: string;
  password: string;
}

interface currentState {
  token: string;
  loading: boolean;
  status: string;
  message: string;
  choosePerson: string;
}
const initialState: currentState = {
  token: localStorage.getItem("admin-token") || "",
  loading: false,
  status: "",
  message: "",
  choosePerson: localStorage.getItem("choosePerson") || "",
};

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (data: AdminData, { rejectWithValue }) => {
    try {
      const datas = await axios.post("http://localhost:5000/admin/login", data);
      return datas.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }
);

export const PersonSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    currentUserDetail: (state) => {
      const token = state.token;
      if (token) {
        const user: any = jwtDecode(token);
        localStorage.setItem("choosePerson", user.accountType);
        return {
          ...state,
          email: user.email,
          _id: user._id,
          choosePerson: user.accountType,
        };
      }

      return state;
    },
    logoutUser: (state) => {
      localStorage.removeItem("admin-token");
      return {
        token: "",
        status: "",
        message: "",
        loading: false,
        choosePerson: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAdmin.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      console.log(action.payload,"admin")
      localStorage.setItem("admin-token", action.payload.token);
      state.token = action.payload.token;
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.loading = false;
    });
  },
});

export default PersonSlice.reducer;
export const { currentUserDetail, logoutUser } = PersonSlice.actions;
