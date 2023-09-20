import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setHeaders } from "../Api";
import userInstance from "../../Axios/UserAxios";
import { API_URL } from "../../config/Endpoint";

export type doctorDetail = {
  _id: string;
  clinicId: string;
  name: string;
  specialized: string;
  qualification: string;
  experience: string;
  document: string;
  verified: string;
  profileImage: string;
  fees: number;
};
interface initialInterface {
  doctorsList: doctorDetail[];
  doctorloading: boolean;
  doctorStatus: string;
  doctorMessage: string;
}

const initialState: initialInterface = {
  doctorsList: [],
  doctorloading: false,
  doctorStatus: "",
  doctorMessage: "",
};
export const CreateDoctor = createAsyncThunk(
  "doctor/CreateDoctor",
  async (doctordata: Partial<doctorDetail>, { rejectWithValue }) => {
    try {
      const datas = await userInstance.post(
        API_URL.ADD_DOCTOR,
        doctordata,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const GetallDoctors = createAsyncThunk(
  "doctor/GetallDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const datas = await userInstance.get(API_URL.GET_DOCTOR, setHeaders());
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const UpdateDoctor = createAsyncThunk(
  "doctor/UpdateDoctor",
  async (updateData: any, { rejectWithValue }) => {
    try {
      const datas = await userInstance.patch(
        API_URL.UPDATE_DOCTOR,
        updateData,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export interface leaveInterface {
  startDate: string;
  endDate: string;
  doctorId: string;
}
export const UpdateDoctorleave = createAsyncThunk(
  "doctor/UpdateDoctorleave",
  async (updateData: leaveInterface, { rejectWithValue }) => {
    try {
      const datas = await userInstance.patch(
        API_URL.UPDATE_LEAVE,
        updateData,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const DocotorDelete = createAsyncThunk(
  "doctor/DocotorDelete",
  async (doctor: any, { rejectWithValue }) => {
    try {
      const datas = await userInstance.post(
        API_URL.DELETE_DOCTOR,
        doctor,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const leaveCancel = createAsyncThunk(
  "doctor/leaveCancel",
  async (data: Partial<leaveInterface>, { rejectWithValue }) => {
    try {
      const datas = await userInstance.patch(
        API_URL.CANCEL_LEAVE,
        data,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const DoctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CreateDoctor.pending, (state, action) => {
      state.doctorloading = true;
    });
    builder.addCase(CreateDoctor.fulfilled, (state, action) => {
      state.doctorloading = false;
    });

    builder.addCase(GetallDoctors.pending, (state, action) => {
      state.doctorloading = true;
    });
    builder.addCase(GetallDoctors.fulfilled, (state, action) => {
      state.doctorloading = false;
      state.doctorStatus = action.payload.status;
      state.doctorsList = action.payload.doctor;
      state.doctorMessage = action.payload.message;
    });

    builder.addCase(UpdateDoctor.pending, (state, action) => {
      state.doctorloading = true;
    });
    builder.addCase(UpdateDoctor.fulfilled, (state, action) => {
      state.doctorloading = false;
      state.doctorStatus = action.payload.status;
      state.doctorMessage = action.payload.message;
    });

    builder.addCase(DocotorDelete.pending, (state, action) => {
      state.doctorloading = true;
    });
    builder.addCase(DocotorDelete.fulfilled, (state, action) => {
      state.doctorloading = false;
      state.doctorStatus = action.payload.status;
      state.doctorMessage = action.payload.message;
    });

    builder.addCase(UpdateDoctorleave.pending, (state, action) => {
      state.doctorloading = true;
    });
    builder.addCase(UpdateDoctorleave.fulfilled, (state, action) => {
      console.log(action.payload, "actiobpaylaod");
      state.doctorloading = false;
      state.doctorStatus = action.payload.status;
      state.doctorMessage = action.payload.message;
    });
  },
});

export default DoctorSlice.reducer;
