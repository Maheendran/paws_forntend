import { PersonSlice } from "./Slice/AuthSlice";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { userSclice } from "./Slice/UserSlice";

export const store = configureStore({
  reducer: {
    auth: PersonSlice.reducer,
    user: userSclice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
