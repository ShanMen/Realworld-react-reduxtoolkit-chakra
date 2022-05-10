import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  favoriteArticle,
  getArticles,
  getFeeds,
  unfavoriteArticle,
} from "../../api/api";
import { RootState } from "../../store/store";
import { Article, ArticleFilter, MultipleArticles } from "../../types/articles";

interface ArticleState {
  articles: MultipleArticles;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const articleAdapter = createEntityAdapter<Article>({
  selectId: (article) => article.slug,
});

export const getArticlesAsync = createAsyncThunk<
  MultipleArticles,
  ArticleFilter,
  { rejectValue: string }
>("getArticles", async (filter: ArticleFilter, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<MultipleArticles> = await getArticles(filter);
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

export const favoriteArticleAsync = createAsyncThunk<
  { article: Article },
  { slug: string },
  { rejectValue: string }
>(
  "favoriteArticleAsync",
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{ article: Article }> =
        await favoriteArticle(slug);
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  },
);

export const unfavoriteArticleAsync = createAsyncThunk<
  { article: Article },
  { slug: string },
  { rejectValue: string }
>(
  "unfavoriteArticleAsync",
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<{ article: Article }> =
        await unfavoriteArticle(slug);
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  },
);

export const getFeedsAsync = createAsyncThunk<
  MultipleArticles,
  ArticleFilter,
  { rejectValue: string }
>("getFeeds", async (filter: ArticleFilter, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<MultipleArticles> = await getFeeds(filter);
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
    const filter = { favorited: username } as ArticleFilter;
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
  status: "idle",
  error: null,
};

export const articleSlice = createSlice({
  name: "article",
  initialState: articleAdapter.getInitialState({
    status: "idle",
    error: "",
  }),
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticlesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArticlesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        articleAdapter.setAll(state, action.payload.articles);
      })
      .addCase(getArticlesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(getMyArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyArticles.fulfilled, (state, action) => {
        state.status = "succeeded";
        articleAdapter.setAll(state, action.payload.articles);
      })
      .addCase(getMyArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(getFavouritedArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFavouritedArticles.fulfilled, (state, action) => {
        state.status = "succeeded";
        articleAdapter.setAll(state, action.payload.articles);
      })
      .addCase(getFavouritedArticles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(getFeedsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFeedsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        articleAdapter.setAll(state, action.payload.articles);
      })
      .addCase(getFeedsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(favoriteArticleAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        articleAdapter.setOne(state, action.payload.article);
      })
      .addCase(unfavoriteArticleAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        articleAdapter.setOne(state, action.payload.article);
      });
  },
});

export const selectArticleBySlug = (state: ArticleState, slug: string) =>
  state.articles.articles.find((article: Article) => article.slug === slug);

export const { initializeState } = articleSlice.actions;

export default articleSlice.reducer;

export const { selectAll: selectAllArticles, selectById: selectArticleById } =
  articleAdapter.getSelectors<RootState>((state) => state.article);
