
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setHeaders } from "../Api";
import userInstance from "../../Axios/UserAxios";
import { API_URL } from "../../config/Endpoint";



export const addComplaint = createAsyncThunk(
  "complaint/addComplaint",
  async (data:any, { rejectWithValue }) => {

    try {
      const datas = await userInstance.post(
        API_URL.ADD_COMPLAINT,
        data,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
// get all complaints
export const getComplaint = createAsyncThunk(
    "complaint/getComplaint",
    async (_, { rejectWithValue }) => {

      try {
        const datas = await userInstance.get(
          API_URL.GET_COMPLAINTS,
          setHeaders()
        );
        return datas.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
//   cancel compalints
export const cancelComplaint = createAsyncThunk(
    "complaint/cancelComplaint",
    async (formdata:any, { rejectWithValue }) => {

      try {
        const datas = await userInstance.post(
          API_URL.CANCEL_COMPLAINT,
          formdata,
          setHeaders()
        );
        return datas.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  );
const initialState = {
    complaintList: [],
    complaintLoading: false,
    complaintStatus: "",
    complaintMessage: "",
  };

export const ComplaintSlice = createSlice({
  name: "complaint",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addComplaint.pending, (state, action) => {
      state.complaintLoading = true;
    });
    builder.addCase(addComplaint.fulfilled, (state, action) => {
      state.complaintLoading = false;
    });
// get all complaints

builder.addCase(getComplaint.pending, (state, action) => {
    state.complaintLoading = true;
  });
  builder.addCase(getComplaint.fulfilled, (state, action) => {
      console.log(action.payload.allcomplaint
        ,"apapp")
    state.complaintLoading = false;
    state.complaintList=action.payload.allcomplaint
  });
//   cancel complaint

builder.addCase(cancelComplaint.pending, (state, action) => {
    state.complaintLoading = true;
  });
  builder.addCase(cancelComplaint.fulfilled, (state, action) => {
 
    state.complaintLoading = false;
  });
  },
});

export default ComplaintSlice.reducer;
