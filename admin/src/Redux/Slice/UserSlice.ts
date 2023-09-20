// import { usersList } from './../../../../../backend/src/modules/Admin/usecases/userUsecase';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setHeaders } from "../Api";
import axios from "axios";
type userList = {
  _id: string;
  accountType: string;
  createdBy: string;
  email: string;
  mobile: string;
  otp: string;
  password: string;
  username: string;
  verified: boolean;
};

type doctorType={
  clinicId:string,
name:string,
specialized:string,
qualification:string,
experience:string,
document:string,
verified:boolean
docVerified:boolean
}

type complaints={
  createdAt:string;
date:string;
message:string;
status:string;
updatedAt:string;
userId:string
}
interface initalInterface {
  petOwnerList: userList[];
  loading: boolean;
  groomingList: userList[];
  clinicList: userList[];
  status: string;
  message: string;
  doctorsList:doctorType[]
  adminDetail:adminData,
  allcomplaint:complaints[]
}

interface adminData {
  email: string;
  Password: string;
  wallet: number;
}

const initialState: initalInterface = {
  petOwnerList: [],
  loading: false,
  groomingList: [],
  clinicList: [],
  status: "",
  message: "",
  doctorsList:[],
  adminDetail: {
    email: "",
    Password: "",
    wallet: 0, 
  },
  allcomplaint:[]
};

export const getcurrentUser = createAsyncThunk(
  "user/getcurrentUser",
  async (_,{rejectWithValue}) => {
    try {
      const datas = await axios.get(
        "http://localhost:5000/admin/current-user",
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(error.response.data);
    }
  }
);
export const getAllPetOwner = createAsyncThunk("user/getPetOwner", async () => {
  try {
    const datas = await axios.get(
      "http://localhost:5000/admin/allPetOwners",
      setHeaders()
    );
    return datas.data;
  } catch (error: any) {
    console.log(error.message);
  }
});

export const getAllClinic = createAsyncThunk("user/getAllClinic", async () => {
  try {
    const datas = await axios.get(
      "http://localhost:5000/admin/allClinic",
      setHeaders()
    );
    return datas.data;
  } catch (error: any) {
    console.log(error.message);
  }
});

export const getGraphData = createAsyncThunk(
  "user/getGraphData",
  async (_,{rejectWithValue}) => {
    try {
      const datas = await axios.get(
        "http://localhost:5000/admin/graph-data",
        setHeaders()
      );
      console.log(datas.data,'datas.data')
      return datas.data;
    } catch (error: any) {
      console.log(error.message);
      return rejectWithValue(error.response.data);
    }
  }
);


//  account blocked==============
type data = {
  id: string;
  accountType: string;
  blocked: boolean;
};
export const AccountBlock = createAsyncThunk(
  "user/AccountBlock",
  async (value: data) => {
    try {
      const datas = await axios.post(
        "http://localhost:5000/admin/account-Block",
        value,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      console.log(error.message);
    }
  }
);

// get all unverfied doctors
export const UnverifiedDoctor = createAsyncThunk("user/UnverifiedDoctor", async () => {
  try {
    const datas = await axios.get(
      "http://localhost:5000/admin/verfication-doctor",
      setHeaders()
    );
    return datas.data;
  } catch (error: any) {
    console.log(error.message);
  }
});

// verified and reject
type datas={
  doctorId:string,
  verified:string
}
export const checkVerification = createAsyncThunk("user/Verification", async (data:any) => {
  try {
    const datas = await axios.post(
      "http://localhost:5000/admin/verified-profile",
      data,
      setHeaders()
    );
    return datas.data;
  } catch (error: any) {
    console.log(error.message);
  }
});


// get complaints

export const getComplaints = createAsyncThunk("user/getComplaints", async () => {
  try {
    const datas = await axios.get(
      "http://localhost:5000/admin/complaints",
      
      setHeaders()
    );
    return datas.data;
  } catch (error: any) {
    console.log(error.message);
  }
});


export const updateComplaint = createAsyncThunk(
  "complaint/updateComplaint",
  async (formdata:any, { rejectWithValue }) => {

    try {
      const datas = await axios.post(
        "http://localhost:5000/admin/update-complaint",
        formdata,
        setHeaders()
      );
      return datas.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);



export const userSclice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    builder.addCase(getcurrentUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getcurrentUser.fulfilled, (state, action) => {
      console.log(action.payload,"slice")
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.adminDetail = action.payload.admin;
      state.loading = false;
    });
    builder.addCase(getAllPetOwner.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllPetOwner.fulfilled, (state, action) => {
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.petOwnerList = action.payload.usersList;
      state.loading = false;
    });

    // get all clinic
    builder.addCase(getAllClinic.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllClinic.fulfilled, (state, action) => {
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.clinicList = action.payload.usersList;
      state.loading = false;
    });
// get verification
builder.addCase(UnverifiedDoctor.pending, (state, action) => {
  state.loading = true;
});
builder.addCase(UnverifiedDoctor.fulfilled, (state, action) => {
  state.loading = false;
  state.status = action.payload.status;
  state.message = action.payload.message;
  state.doctorsList = action.payload.doctor;

});

// verfied and reject 
builder.addCase(checkVerification.pending, (state, action) => {
  state.loading = true;
});
builder.addCase(checkVerification.fulfilled, (state, action) => {
  state.loading = false;
  state.status = action.payload.status;
  state.message = action.payload.message;

});


// get complaints

builder.addCase(getComplaints.pending, (state, action) => {
  state.loading = true;
});
builder.addCase(getComplaints.fulfilled, (state, action) => {
  console.log(action.payload.allcomplaint,"paylaod=================")
  state.loading = false;
  state.status = action.payload.status;
  state.message = action.payload.message;
  state.allcomplaint=action.payload.allcomplaint

});

  },
});

export default userSclice.reducer;
