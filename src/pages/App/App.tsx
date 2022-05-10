import * as React from "react";
import { Box, Spinner } from "@chakra-ui/react";
import { Navigate, Outlet, Route, RouteProps, Routes } from "react-router-dom";
import Header from "../../layouts/header";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";
import Settings from "../Settings/Settings";
import ArticlePage from "../ArticlePage/ArticlePage";
import NewArticle from "../NewArticle/NewArticle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUserAsync, updateStatus } from "./App.slice";
import axios from "axios";
import { CommonHeaderProperties } from "../../types/axiosheader";
import Home from "../Home/Home";
import EditArticle from "../EditArticle/EditArticle";
import ChangePassword from "../Settings/ChangePassword";
import Profile from "../Profile/Profile";

export const App = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const { isAuthenticated } = useAppSelector((state) => state.app);

  if (token) {
    axios.defaults.headers = {
      Authorization: "Token " + token,
    } as CommonHeaderProperties;
  }

  React.useEffect(() => {
    if (!token) {
      dispatch(updateStatus("succeeded"));
      return;
    }
    if (!isAuthenticated) {
      dispatch(getUserAsync());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <Box
      maxW={{ base: "100%" }}
      m="auto"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
    >
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<GuestOnlyRoute userIsLogged={isAuthenticated} />}
        >
          <Route path="/login" element={<SignIn />} />
        </Route>
        <Route
          path="/signup"
          element={<GuestOnlyRoute userIsLogged={isAuthenticated} />}
        >
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route
          path="/settings"
          element={<UserOnlyRoute userIsLogged={isAuthenticated} />}
        >
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route
          path="/change-password"
          element={<UserOnlyRoute userIsLogged={isAuthenticated} />}
        >
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
        <Route
          path="/editor"
          element={<UserOnlyRoute userIsLogged={isAuthenticated} />}
        >
          <Route path="/editor" element={<NewArticle />} />
        </Route>
        <Route
          path="/editor/:slug"
          element={<UserOnlyRoute userIsLogged={isAuthenticated} />}
        >
          <Route path="/editor/:slug" element={<EditArticle />} />
        </Route>
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/article/:slug" element={<ArticlePage />}></Route>
      </Routes>
    </Box>
  );
};

function GuestOnlyRoute({
  userIsLogged,
}: {
  userIsLogged: boolean;
} & RouteProps) {
  return !userIsLogged ? <Outlet /> : <Navigate to="/" />;
}

function UserOnlyRoute({
  userIsLogged,
}: {
  userIsLogged: boolean;
} & RouteProps) {
  const { isAuthenticated, status } = useAppSelector((state) => state.app);

  if (isAuthenticated) {
    return <Outlet />;
  }

  if ((status === "succeeded") && !userIsLogged) {
    return <Navigate to="/" />;
  }

  if (status === "loading") {
    return <Spinner />;
  }
  return null;
}
