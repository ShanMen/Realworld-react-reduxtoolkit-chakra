import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { getTags } from "../../api/api";
import { CustomTabsProps } from "../../components/CustomTabs";

interface HomeState {
  tags: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedTab: string;
  tabs: CustomTabsProps[];
}

export const getTagsAsync = createAsyncThunk<
  { tags: string[] },
  void,
  { rejectValue: string }
>("tags", async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<{ tags: string[] }> = await getTags();
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

const initialState: HomeState = {
  tags: [],
  status: "idle",
  error: null,
  selectedTab: "Global Feed",
  tabs: [{
    tabTitle: "Your Feed",
    isHidden: true,
    tabIndex: 0,
    customTab: false,
  } as CustomTabsProps, {
    tabTitle: "Global Feed",
    isHidden: false,
    tabIndex: 1,
    customTab: false,
  } as CustomTabsProps, {
    tabTitle: "Custom Tab",
    isHidden: true,
    tabIndex: 2,
    customTab: true,
  } as CustomTabsProps],
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
    updateSelectedTab: (
      state,
      { payload: { tab } }: PayloadAction<{ tab: string }>,
    ) => {
      state.selectedTab = tab;
    },
    removeTab: (
      state,
      { payload: { tabTitle } }: PayloadAction<{ tabTitle: string }>,
    ) => {
      state.tabs = state.tabs.filter((t) => t.tabTitle !== tabTitle);
    },
    updateTab: (
      state,
      { payload: { tab } }: PayloadAction<{ tab: CustomTabsProps }>,
    ) => {
      let toUpdateTab = state.tabs.findIndex((i) =>
        i.tabTitle === tab.tabTitle
      );
      state.tabs[toUpdateTab] = { ...state.tabs[toUpdateTab], ...tab };
    },
    updateCustomTab: (
      state,
      { payload: { tab } }: PayloadAction<{ tab: CustomTabsProps }>,
    ) => {
      state.tabs[2] = { ...state.tabs[2], ...tab };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTagsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTagsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tags = action.payload.tags;
      })
      .addCase(getTagsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      });
  },
});

export const {
  initializeState,
  updateCustomTab,
  updateTab,
  removeTab,
  updateSelectedTab,
} = homeSlice.actions;

export default homeSlice.reducer;
