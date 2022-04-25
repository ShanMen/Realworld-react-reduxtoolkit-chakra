import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import {
  deleteArticle,
  deleteComment,
  getArticle,
  getArticleComments,
  postArticleComment,
} from "../../api/api";
import { Article, Comment } from "../../types/articles";

interface ArticlePageState {
  comments: Comment[];
  newComment: string;
  article: Article;
  status: "idle" | "loading" | "succeeded" | "failed";
  commentStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const getArticleAsync = createAsyncThunk<
  { article: Article },
  string,
  { rejectValue: string }
>("getArticle", async (slug: string, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<{ article: Article }> = await getArticle(
      slug,
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

export const deleteArticleAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "deleteArticle",
  async (slug: string, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response: AxiosResponse = await deleteArticle(
        slug,
      );
      if (response.status !== 204) {
        throw Error("Error processing");
      }

      return "Ok";
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  },
);

export const getArticleCommentsAsync = createAsyncThunk<
  { comments: Comment[] },
  string,
  { rejectValue: string }
>("getArticleComments", async (slug: string, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<{ comments: Comment[] }> =
      await getArticleComments(slug);
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message);
  }
});

export const deleteArticleCommentAsync = createAsyncThunk<
  any,
  { slug: string; commentId: number },
  { rejectValue: string }
>(
  "deleteArticleComment",
  async (
    { slug, commentId }: { slug: string; commentId: number },
    { rejectWithValue, fulfillWithValue },
  ) => {
    try {
      const response: AxiosResponse = await deleteComment(slug, commentId);
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  },
);

export const postArticleCommentAsync = createAsyncThunk<
  { comment: Comment },
  { slug: string; comment: string },
  { rejectValue: string }
>(
  "postArticleComment",
  async (
    { slug, comment }: { slug: string; comment: string },
    { rejectWithValue },
  ) => {
    try {
      const response: AxiosResponse<{ comment: Comment }> =
        await postArticleComment(slug, comment);
      return response.data;
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message);
    }
  },
);

const initialState: ArticlePageState = {
  comments: [],
  article: {} as Article,
  status: "idle",
  commentStatus: "idle",
  error: null,
  newComment: "",
};

export const articlePageSlice = createSlice({
  name: "articlePage",
  initialState,
  reducers: {
    initializeState: (state) => Object.assign(state, initialState),
    updateField: (
      state,
      { payload: { newComment } }: PayloadAction<{ newComment: string }>,
    ) => {
      state.newComment = newComment;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticleAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArticleAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.article = action.payload.article;
      })
      .addCase(getArticleAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(deleteArticleAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteArticleAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteArticleAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(getArticleCommentsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArticleCommentsAsync.fulfilled, (state, action) => {
        state.comments = action.payload.comments;
      })
      .addCase(getArticleCommentsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "";
      })
      .addCase(postArticleCommentAsync.pending, (state) => {
        state.commentStatus = "loading";
      })
      .addCase(postArticleCommentAsync.fulfilled, (state, action) => {
        state.commentStatus = "succeeded";
        state.comments.push(action.payload.comment);
      })
      .addCase(postArticleCommentAsync.rejected, (state, action) => {
        state.commentStatus = "failed";
        state.error = action.payload || "";
      })
      .addCase(deleteArticleCommentAsync.fulfilled, (state, action) => {
        state.commentStatus = "succeeded";
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.meta.arg.commentId,
        );
      })
      .addCase(deleteArticleCommentAsync.rejected, (state, action) => {
        state.commentStatus = "failed";
        state.error = action.payload || "";
      });
  },
});

export const { updateField, initializeState } = articlePageSlice.actions;

export default articlePageSlice.reducer;
