import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setHeaders } from "../Api";
import userInstance from "../../Axios/UserAxios";
import { API_URL } from "../../config/Endpoint";
export type userList = {
  _id: string;
  accountType: string;
  createdBy: string;
  email: string;
  mobile: string;
  otp: string;
  password: string;
  username: string;
  verified: boolean;
  upi: string;
  blocked: boolean;
  shopName: string;
  ownerName: string;
  wallet: number | undefined;
  clinicName: string;
  profileImage: string;
  doctorlist?: any;
  address?: any;
  name?:any;
  qualification?:string;
  experience?:string;
  clinicDetails:any

};
export type addresList = {
  _id: string;
  userId: string;
  name: string;
  mobile: string;
  adressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  longitude:number,
  latitude:number
};
interface initalInterface {
  currentUser: Partial<userList>;
  token: string;
  userStatus: string;
  userMessage: string;
  userloading: boolean;
  userAddress: Partial<addresList>;
}
const initialState: initalInterface = {
  currentUser: {},
  token: localStorage.getItem("token") || "",
  userStatus: "",
  userMessage: "",
  userloading: false,
  userAddress: {},
};
export const getcurrentUser = createAsyncThunk(
  "user/getcurrentUser",
  async (_,{rejectWithValue}) => {
    try {
      const datas = await userInstance.get(API_URL.CURRENT_USER, setHeaders());
      return datas.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(error.response.data);
    }
  }
);
export const UpdatecurrentUser = createAsyncThunk(
  "user/UpdatecurrentUser",
  async (currentUser: Partial<userList>) => {
    try {
      const datas = await userInstance.patch(
        API_URL.UPDATE_USER,
        currentUser,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }
);
export const Updateprofilepic = createAsyncThunk(
  "user/Updateprofilepic",
  async (data: any | ArrayBuffer | null) => {
    try {
      const datas = await userInstance.patch(
        API_URL.UPDATE_PROFILE_PIC,
        data,
        setHeaders()
      );

      return datas.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }
);
export interface verificationInterface {
  "id-proof": File | null;
  agreement: File | null;
  image: string | null;
}
export const Updateaddress = createAsyncThunk(
  "user/Updateaddress",
  async (currentAddress: Partial<addresList>) => {
    try {
  
      const datas = await userInstance.patch(
        API_URL.UPDATE_ADDRESS,
        currentAddress,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }
);
export const Createaddress = createAsyncThunk(
  "user/Createaddress",
  async (newAddress: Partial<addresList>,{rejectWithValue}) => {
    try {
      console.log(newAddress,'newAddress')
      const datas = await userInstance.post(
        API_URL.NEW_ADDRESS,
        newAddress,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const UserDetailSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getcurrentUser.pending, (state, action) => {
      state.userloading = true;
    });
    builder.addCase(getcurrentUser.fulfilled, (state, action) => {
     
          state.userloading = false;
      state.userStatus = action.payload.status;
      state.userMessage = action.payload.message;
      state.currentUser = action.payload?.userdata || {};
      state.userAddress = action.payload?.address || {};
    
    });

    builder.addCase(getcurrentUser.rejected, (state, action) => {
      state.userloading = false;
    });
    builder.addCase(UpdatecurrentUser.pending, (state, action) => {
      state.userloading = true;
    });
    builder.addCase(UpdatecurrentUser.fulfilled, (state, action) => {
      state.userStatus = action.payload.status;
      state.userMessage = action.payload.message;
      state.userloading = false;
      if (action.payload?.userdata) {
        state.currentUser = action.payload?.userdata;
      }
    });
    builder.addCase(Updateprofilepic.pending, (state, action) => {
      state.userloading = true;
    });
    builder.addCase(Updateprofilepic.fulfilled, (state, action) => {
      state.userStatus = action.payload.status;
      state.userMessage = action.payload.message;
      state.userloading = false;
      if (action.payload?.userdata) {
        state.currentUser = action.payload?.userdata;
      }
    });
    builder.addCase(Updateaddress.pending, (state, action) => {
      state.userloading = true;
    });
    builder.addCase(Updateaddress.fulfilled, (state, action) => {
      state.userStatus = action.payload.status;
      state.userMessage = action.payload.message;
      state.userloading = false;
      if (action.payload?.address) {
        state.userAddress = action.payload?.address;
      }
    });
    builder.addCase(Createaddress.pending, (state, action) => {
      state.userloading = true;
    });
    builder.addCase(Createaddress.fulfilled, (state, action) => {
      state.userStatus = action.payload.status;
      state.userMessage = action.payload.message;
      state.userloading = false;
      if (action.payload?.address) {
        state.userAddress = action.payload?.address;
      }
    });
  },
});

export default UserDetailSlice.reducer;
