import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { createArticle, editArticle } from "../../api/api";
import { Article, CreateArticle } from "../../types/articles";

interface ArticleEditorState {
  user: {
    username: string;
    password: string;
    email: string;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ArticleEditorState = {
  user: {
    email: "",
    username: "",
    password: "",
  },
  status: "idle",
  error: null,
};

export const newArticleAsync = createAsyncThunk<
  { article: Article },
  { article: CreateArticle },
  { rejectValue: string }
>(
  "newArticle",
  async (
    { article }: { article: CreateArticle },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response: AxiosResponse<{ article: Article }> = await createArticle(
        article,
      );
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  },
);

export const editArticleAsync = createAsyncThunk<
  { article: Article },
  { article: CreateArticle; slug: string },
  { rejectValue: string }
>(
  "editArticle",
  async (
    { article, slug }: { article: CreateArticle; slug: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response: AxiosResponse<{ article: Article }> = await editArticle(
        article,
        slug,
      );
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  },
);

export const articleEditorSlice = createSlice({
  name: "articleEditor",
  initialState,
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
    updateField: (
      state,
      {
        payload: { name, value },
      }: PayloadAction<
        { name: keyof ArticleEditorState["user"]; value: string }
      >,
    ) => {
      state.user[name] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(newArticleAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(newArticleAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(newArticleAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(editArticleAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editArticleAsync.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(editArticleAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      });
  },
});

export const { updateField, initializeState } = articleEditorSlice.actions;

export default articleEditorSlice.reducer;
