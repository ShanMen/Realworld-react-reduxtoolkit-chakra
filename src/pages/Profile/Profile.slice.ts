import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { followUser, getProfile, unfollowUser } from "../../api/api";
import { CustomTabsProps } from "../../components/CustomTabs";
import { Profile } from "../../types/user";

interface ArticleState {
  profile: Profile;
  status: "idle" | "loading" | "succeeded" | "failed";
  followStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedTab: string;
  tabs: CustomTabsProps[];
}

export const getProfileByUsername = createAsyncThunk<
  { profile: Profile },
  string,
  { rejectValue: string }
>("getProfileByUsername", async (username: string, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<{ profile: Profile }> = await getProfile(
      username,
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

export const followUserAsync = createAsyncThunk<
  { profile: Profile },
  string,
  { rejectValue: string }
>("followUser", async (username: string, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<{ profile: Profile }> = await followUser(
      username,
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

export const unfollowUserAsync = createAsyncThunk<
  { profile: Profile },
  string,
  { rejectValue: string }
>("unfollowUser", async (username: string, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<{ profile: Profile }> = await unfollowUser(
      username,
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

const initialState: ArticleState = {
  profile: {} as Profile,
  status: "idle",
  followStatus: "idle",
  error: null,
  selectedTab: "My Articles",
  tabs: [{
    tabTitle: "My Articles",
    isHidden: false,
    tabIndex: 0,
    customTab: false,
  } as CustomTabsProps, {
    tabTitle: "Favorited Articles",
    isHidden: false,
    tabIndex: 1,
    customTab: false,
  } as CustomTabsProps],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
    updateSelectedTab: (
      state,
      { payload: { tab } }: PayloadAction<{ tab: string }>,
    ) => {
      state.selectedTab = tab;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileByUsername.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfileByUsername.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload.profile;
      })
      .addCase(getProfileByUsername.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(followUserAsync.pending, (state) => {
        state.followStatus = "loading";
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        state.profile = action.payload.profile;
      })
      .addCase(followUserAsync.rejected, (state, action) => {
        state.followStatus = "failed";
        state.error = action.payload || "";
      })
      .addCase(unfollowUserAsync.pending, (state) => {
        state.followStatus = "loading";
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        state.profile = action.payload.profile;
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        state.followStatus = "failed";
        state.error = action.payload || "";
      });
  },
});

export const { updateSelectedTab, initializeState } = profileSlice.actions;

export default profileSlice.reducer;
