import axios from "axios";
import { ArticleFilter, CreateArticle } from "../types/articles";
import { UpdateUser } from "../types/user";

axios.defaults.baseURL = process.env.REACT_APP_API_HOST;

export const login = async (email: string, password: string) => {
  return axios.post("/users/login", {
    user: { email, password },
  });
};

export const signUp = async (
  username: string,
  email: string,
  password: string,
) => {
  return axios.post("/users", {
    user: { username, email, password },
  });
};

export const getUser = async () => {
  return axios.get("/user");
};

export const getTags = async () => {
  return axios.get("/tags");
};

export const getArticles = async (header: ArticleFilter) => {
  const filter = {
    limit: header.limit ?? 10,
    offset: header.offset ?? 0,
    ...header,
  };

  let query = buildHeaderQuery(filter);
  return axios.get(`/articles?${query}`);
};

export const getFeeds = async (header: ArticleFilter) => {
  const filter = {
    limit: header.limit ?? 10,
    offset: header.offset ?? 0,
    ...header,
  };

  let query = buildHeaderQuery(filter);
  return axios.get(`/articles/feed?${query}`);
};

export const getArticle = async (slug: string) => {
  return axios.get("/articles/" + slug);
};

export const getArticleComments = async (slug: string) => {
  return axios.get("/articles/" + slug + "/comments");
};

export const postArticleComment = async (slug: string, comment: string) => {
  return axios.post("articles/" + slug + "/comments", {
    comment: {
      body: comment,
    },
  });
};

export const deleteComment = async (slug: string, commentId: number) => {
  return axios.delete("articles/" + slug + "/comments/" + commentId);
};

export const favoriteArticle = async (slug: string) => {
  return axios.post("articles/" + slug + "/favorite");
};

export const unfavoriteArticle = async (slug: string) => {
  return axios.delete("articles/" + slug + "/favorite");
};

export const createArticle = async (article: CreateArticle) => {
  return axios.post("articles/", { article: article });
};

export const editArticle = async (article: CreateArticle, slug: string) => {
  return axios.put("articles/" + slug, { article: article });
};

export const deleteArticle = async (slug: string) => {
  return axios.delete("articles/" + slug);
};

export const updateUser = async (user: UpdateUser) => {
  return axios.put(
    "user/",
    {
      user,
    },
  );
};

export const getProfile = async (username: string) => {
  return axios.get("profiles/" + username);
};

const buildHeaderQuery = (filter: Record<any, any>) => {
  return Object.entries(filter)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
};

export default axios;
