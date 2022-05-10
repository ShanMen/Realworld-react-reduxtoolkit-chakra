import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { getUser } from "../../api/api";
import { loadUserIntoApp, logoutUserFromApp, User } from "../../types/user";

interface AppState {
  user?: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  isAuthenticated: boolean;
}

export const getUserAsync = createAsyncThunk<
  { user: User },
  void,
  { rejectValue: string }
>("app/users", async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<{ user: User }> = await getUser();
    loadUserIntoApp(response.data.user);
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

const initialState: AppState = {
  user: null,
  status: "idle",
  isAuthenticated: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
    updateStatus: (
      state,
      { payload: status }: PayloadAction<
        "idle" | "loading" | "succeeded" | "failed"
      >,
    ) => {
      state.status = status;
    },
    loginUser: (state, { payload: user }: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = user;
    },
    logoutUser: (state) => {
      Object.assign(state, initialState);
      logoutUserFromApp();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserAsync.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
  },
});

export const { updateStatus, logoutUser, loginUser, initializeState } =
  appSlice.actions;

export default appSlice.reducer;
