import axios from "axios";
import { CommonHeaderProperties } from "./axiosheader";

export interface User {
  username: string;
  bio: string | null;
  image: string | null;
  email: string;
  token: string;
}

export interface UpdateUser {
  username: string;
  bio: string | null;
  image: string | null;
  email: string;
  password: string;
}

export interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  email: string;
}

export function loadUserIntoApp(user: User) {
  localStorage.setItem("token", user.token);
  axios.defaults.headers = {
    Authorization: "Token " + user.token,
  } as CommonHeaderProperties;
}

export function logoutUserFromApp() {
  localStorage.removeItem("token");
  axios.defaults.headers = {} as CommonHeaderProperties;
}
