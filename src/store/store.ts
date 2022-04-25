import { configureStore } from "@reduxjs/toolkit";
import ArticleListSlice from "../components/ArticleList/ArticleList.slice";
import AppSlice from "../pages/App/App.slice";
import ArticlePageSlice from "../pages/ArticlePage/ArticlePage.slice";
import HomeSlice from "../pages/Home/Home.slice";
import SignInSlice from "../pages/SignIn/SignIn.slice";
import SignUpSlice from "../pages/SignUp/SignUp.slice";
import ArticleEditor from "../pages/ArticleEditor/ArticleEditor.slice";
import SettingsSlice from "../pages/Settings/Settings.slice";

const store = configureStore({
  reducer: {
    signIn: SignInSlice,
    signUp: SignUpSlice,
    app: AppSlice,
    home: HomeSlice,
    articlePage: ArticlePageSlice,
    article: ArticleListSlice,
    articleEditor: ArticleEditor,
    settings: SettingsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
