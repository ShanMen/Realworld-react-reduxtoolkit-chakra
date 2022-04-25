import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { updateUser } from "../../api/api";
import { loadUserIntoApp, UpdateUser, User } from "../../types/user";

interface SettingsState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SettingsState = {
  status: "idle",
  error: null,
};

export const updateUserAsync = createAsyncThunk<
  { user: User },
  { user: UpdateUser },
  { rejectValue: string }
>(
  "updateUser",
  async (
    { user }: { user: UpdateUser },
    { rejectWithValue },
  ) => {
    try {
      const response: AxiosResponse<{ user: User }> = await updateUser(
        user,
      );
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  },
);

export const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        loadUserIntoApp(action.payload.user);
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      });
  },
});

export const { initializeState } = settingSlice.actions;

export default settingSlice.reducer;
