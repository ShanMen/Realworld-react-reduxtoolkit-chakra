import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { login } from "../../api/api";
import { User, loadUserIntoApp } from "../../types/user";
import { loginUser } from "../App/App.slice";

interface SignInState {
  user: {
    username: string;
    password: string;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const SignInAction = createAsyncThunk<
  { user: User },
  { username: string; password: string },
  { rejectValue: string }
>(
  "users/login",
  async (
    { username, password }: { username: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response: AxiosResponse<{ user: User }> = await login(
        username,
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

const initialState: SignInState = {
  user: {
    username: "",
    password: "",
  },
  status: "idle",
  error: null,
};

export const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
    updateField: (
      state,
      {
        payload: { name, value },
      }: PayloadAction<{ name: keyof SignInState["user"]; value: string }>
    ) => {
      state.user[name] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignInAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(SignInAction.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(SignInAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      });
  },
});

export const { updateField, initializeState } = signInSlice.actions;

export default signInSlice.reducer;
