import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { getProfile } from "../../api/api";
import { CustomTabsProps } from "../../components/CustomTabs";
import { Profile } from "../../types/user";

interface ArticleState {
  profile: Profile;
  status: "idle" | "loading" | "succeeded" | "failed";
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

const initialState: ArticleState = {
  profile: {} as Profile,
  status: "idle",
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
      });
  },
});

export const { updateSelectedTab, initializeState } = profileSlice.actions;

export default profileSlice.reducer;
