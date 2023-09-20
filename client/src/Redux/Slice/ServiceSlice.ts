import { userList } from "./UserDetailSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setHeaders } from "../Api";
import userInstance from "../../Axios/UserAxios";
import { API_URL } from "../../config/Endpoint";
interface docTimeslot {
  _id: string;
  user_id: string;
  time: string;
  date: string;
  clinicId: string;
  doctorId: string;
  status: string;
  reason: string;
  Bookings: any;
}
interface payment {
  credited_id: string;
  debited_id: string;
  debited_name: string;
  credited_name: string;
  amount: number;
  paymentType: string;
  time: number;
  date: string;
  status: string;
  type: string;
}
type HistoryAndTimeslotArray = {
  clinicInfo: Partial<userList>[],
  Historys: Partial<docTimeslot>[]
}
  
interface currentState {
  serviceStatus: string;
  serviceMessage: string;
  serviceList: userList[];
  serviceloading: boolean;
  serviceDetail: Partial<userList >[];
  timeslots: docTimeslot[];
  paymentHistory: payment[];
  Historys:any[];
}
const initialState: currentState = {
  serviceloading: false,
  serviceStatus: "",
  serviceMessage: "",
  serviceList: [],
  serviceDetail: [],
  timeslots: [],
  paymentHistory: [],
  Historys:[]
};

export const getNerestService = createAsyncThunk(
  "service/getNerestService",
  async (_, { rejectWithValue }) => {
    try {
      const datas = await userInstance.get(
        API_URL.NEAREST_SERVICE,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const SearchPlace = createAsyncThunk(
  "service/SearchPlace",
  async ({ searchValue ,selectedValue}: { searchValue: string,selectedValue:string }, { rejectWithValue }) => {
    try {
      const datas = await userInstance.get(
        `${API_URL.SEARCH_CLINIC}?search=${selectedValue}&value=${searchValue}`,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const getclinicDetail = createAsyncThunk(
  "service/getclinicDetail",
  async (
    { clinicId }: { clinicId: string | undefined },
    { rejectWithValue }
  ) => {
    try {
      const datas = await userInstance.get(
        `${API_URL.SERVICE_DETAIL}/${clinicId}`,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
type formdatatype = {
  date: string;
  clinicId: string | undefined;
  doctorId: string;
};
export const getDoctorTimeslot = createAsyncThunk(
  "service/getDoctorTimeslot",
  async (formdata: formdatatype, { rejectWithValue }) => {
    try {
      const datas = await userInstance.post(
        API_URL.TIME_SLOT,
        formdata,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
type formdataType = {
  clinicId: string | undefined;
  doctorId: string | undefined;
  date: string;
  time: string;
  bookingId: string;
};
export const BookClinicSlot = createAsyncThunk(
  "service/BookClinicSlot",
  async (formdata: Partial<formdataType>, { rejectWithValue }) => {
    try {
      const datas = await userInstance.post(
        API_URL.BOOKING_CLINIC,
        formdata,
        setHeaders()
      );

      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const cancellingslot = createAsyncThunk(
  "service/cancellingslot",
  async (formdata: Partial<formdataType>, { rejectWithValue }) => {
    try {
      const datas = await userInstance.post(
        API_URL.BOOKING_CANCEL,
        formdata,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
interface PaymentInterface {
  credited_id: string;
  debited_id: string;
  debited_name: string;
  credited_name: string;
  amount: number;
  paymentType: string;
  time: number;
  date: string;
  status: string;
}
export const BookingPayment = createAsyncThunk(
  "service/payment",
  async (formdata: PaymentInterface, { rejectWithValue }) => {
    try {
      const datas = await userInstance.post(
        API_URL.BOOKING_PAYMENT,
        formdata,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const CancelPayment = createAsyncThunk(
  "service/CancelPayment",
  async (formdata: PaymentInterface, { rejectWithValue }) => {
    try {
      const datas = await userInstance.post(
        API_URL.PAYMENT_CANCEL,
        formdata,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const PaymentHistory = createAsyncThunk(
  "service/PaymentHistory",
  async (_, { rejectWithValue }) => {
    try {
      const datas = await userInstance.get(
        API_URL.PAYMENT_HISTORY,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const BookingsHistory = createAsyncThunk(
  "service/BookingHistory",
  async (_, { rejectWithValue }) => {
    try {
      const datas = await userInstance.get(
        API_URL.BOOKING_HISTORY,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const HistoryDetails = createAsyncThunk(
  "service/HistoryDetails",
  async (clinicId:string| undefined, { rejectWithValue }) => {
    try {
   
      const datas = await userInstance.get(
        `${API_URL.HISTORY_DETAIL}/${clinicId}`,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ServiceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNerestService.pending, (state, action) => {
      state.serviceloading = true;
    });
    builder.addCase(getNerestService.fulfilled, (state, action) => {
      state.serviceStatus = action.payload.status;
      state.serviceMessage = action.payload.message;
      state.serviceloading = false;
      state.serviceList = action.payload.searchdata;
    });

    builder.addCase(SearchPlace.pending, (state, action) => {
      state.serviceloading = true;
    });
    builder.addCase(SearchPlace.fulfilled, (state, action) => {

      state.serviceStatus = action.payload.status;
      state.serviceMessage = action.payload.message;
      state.serviceloading = false;
      state.serviceList = action.payload.searchdata;
    });

    builder.addCase(getclinicDetail.pending, (state, action) => {
      state.serviceloading = true;
    });

    builder.addCase(getclinicDetail.fulfilled, (state, action) => {
      state.serviceStatus = action.payload?.status;
      state.serviceMessage = action.payload?.message;
      state.serviceloading = false;
      state.serviceDetail = action.payload?.detail;
    });

    builder.addCase(getDoctorTimeslot.pending, (state, action) => {
      state.serviceloading = true;
    });
    builder.addCase(getDoctorTimeslot.fulfilled, (state, action) => {
      console.log(action.payload,"action")
      state.serviceStatus = action.payload?.status;
      state.serviceMessage = action.payload?.message;
      state.serviceloading = false;
      state.timeslots = action.payload?.timslots;
    });

    builder.addCase(cancellingslot.pending, (state, action) => {
      state.serviceloading = true;
    });
    builder.addCase(cancellingslot.fulfilled, (state, action) => {
      state.serviceStatus = action.payload?.status;
      state.serviceMessage = action.payload?.message;
      state.serviceloading = false;
    });

    builder.addCase(PaymentHistory.pending, (state, action) => {
      state.serviceloading = true;
    });
    builder.addCase(PaymentHistory.fulfilled, (state, action) => {
      state.serviceStatus = action.payload?.status;
      state.serviceMessage = action.payload?.message;
      state.paymentHistory = action.payload?.history;

      state.serviceloading = false;
    });
    
    builder.addCase(BookingsHistory.pending, (state, action) => {
      state.serviceloading = true;
    });
    builder.addCase(BookingsHistory.fulfilled, (state, action) => {

      state.serviceStatus = action.payload?.status;
      state.serviceMessage = action.payload?.message;
      state.Historys = action.payload?.history;
      state.serviceloading = false;
    });
    builder.addCase(BookingsHistory.rejected, (state, action) => {
      state.serviceloading = false;
   
    });
    builder.addCase(HistoryDetails.pending, (state, action) => {
      state.serviceloading = true;
    });

    builder.addCase(HistoryDetails.fulfilled, (state, action) => {
      state.serviceStatus = action.payload?.status;
      state.serviceMessage = action.payload?.message;
      state.serviceloading = false;
      state.serviceDetail = action.payload?.history;
    });
  },
});

export default ServiceSlice.reducer;
