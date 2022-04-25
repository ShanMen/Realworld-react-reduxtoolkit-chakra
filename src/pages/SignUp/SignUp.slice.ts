import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { signUp } from "../../api/api";
import { User, loadUserIntoApp } from "../../types/user";
import { loginUser } from "../App/App.slice";

interface SignUpState {
  user: {
    username: string;
    password: string;
    email: string;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const signUpAsync = createAsyncThunk<
  { user: User },
  { email: string; username: string; password: string },
  { rejectValue: string }
>(
  "users",
  async (
    {
      email,
      username,
      password,
    }: { email: string; username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response: AxiosResponse<{ user: User }> = await signUp(
        username,
        email,
        password
      );
      loadUserIntoApp(response.data.user);
      dispatch(loginUser(response.data.user));
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  }
);

const initialState: SignUpState = {
  user: {
    email: "",
    username: "",
    password: "",
  },
  status: "idle",
  error: null,
};

export const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
    updateField: (
      state,
      {
        payload: { name, value },
      }: PayloadAction<{ name: keyof SignUpState["user"]; value: string }>
    ) => {
      state.user[name] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signUpAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      });
  },
});

export const { updateField, initializeState } = signUpSlice.actions;

export default signUpSlice.reducer;
