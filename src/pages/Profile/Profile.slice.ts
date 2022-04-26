import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { getArticles, getProfile } from "../../api/api";
import { RootState } from "../../store/store";
import { Article, ArticleFilter, MultipleArticles } from "../../types/articles";
import { Profile } from "../../types/user";

interface ArticleState {
  articles: MultipleArticles;
  profile?: Profile;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const profileAdapter = createEntityAdapter<Article>({
  selectId: (article) => article.slug,
});

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

export const getFavouritedArticles = createAsyncThunk<
  MultipleArticles,
  string,
  { rejectValue: string }
>("getFavouritedArticles", async (username: string, { rejectWithValue }) => {
  try {
    const filter = { favourited: username } as ArticleFilter;
    const response: AxiosResponse<MultipleArticles> = await getArticles(filter);
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

export const getMyArticles = createAsyncThunk<
  MultipleArticles,
  string,
  { rejectValue: string }
>("getMyArticles", async (username: string, { rejectWithValue }) => {
  try {
    const filter = { author: username } as ArticleFilter;
    const response: AxiosResponse<MultipleArticles> = await getArticles(filter);
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

const initialState: ArticleState = {
  articles: {
    articles: [],
    articleCount: 0,
  },
  profile: undefined,
  status: "idle",
  error: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: profileAdapter.getInitialState({
    profile: {} as Profile,
    status: "idle",
    error: "",
  }),
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyArticles.fulfilled, (state, action) => {
        profileAdapter.setAll(state, action.payload.articles);
      })
      .addCase(getMyArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(getFavouritedArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFavouritedArticles.fulfilled, (state, action) => {
        profileAdapter.setAll(state, action.payload.articles);
      })
      .addCase(getFavouritedArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
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

export const selectArticleBySlug = (state: ArticleState, slug: string) =>
  state.articles.articles.find((article: Article) => article.slug === slug);

export const { initializeState } = profileSlice.actions;

export default profileSlice.reducer;

export const { selectAll: selectAllArticles, selectById: selectArticleById } =
  profileAdapter.getSelectors<RootState>((state) => state.article);
