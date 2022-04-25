import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUp from "../SignUp/SignUp";
import { App } from "../App/App";
import { BrowserRouter } from "react-router-dom";
import { render } from "../../test-utils";
import store from "../../store/store";
import { updateField } from "./SignUp.slice";
import { initializeState } from "../App/App.slice";

const mockedUsedLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useLocation: () => mockedUsedLocation,
}));
let url = process.env.REACT_APP_API_HOST;

const serverHandlers = [
  rest.get(url + "/articles", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        articles: [
          {
            "slug": "hi-35023",
            "title": "hi",
            "description": "hi",
            "body": "hi",
            "tagList": [],
            "createdAt": "2022-04-13T08:13:37.553Z",
            "updatedAt": "2022-04-13T08:13:37.553Z",
            "favorited": false,
            "favoritesCount": 1,
            "author": {
              "username": "qqq123b",
              "bio": null,
              "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
              "following": false,
            },
          },
          {
            "slug": "NEw-post-35023",
            "title": "new post",
            "description": "new post",
            "body": "new post",
            "tagList": [],
            "createdAt": "2022-04-08T09:02:41.218Z",
            "updatedAt": "2022-04-08T09:02:56.766Z",
            "favorited": false,
            "favoritesCount": 0,
            "author": {
              "username": "qqq123b",
              "bio": null,
              "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
              "following": false,
            },
          },
        ],
      }),
    );
  }),
  rest.get(url + "/tags", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        tags: [
          "welcome",
          "implementations",
          "codebaseShow",
        ],
      }),
    );
  }),
  rest.post(url + "/users", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          username: "test username",
          email: "test email",
          bio: "test user",
          token: "test token",
          image: "test image",
        },
      }),
    );
  }),
];

const server = setupServer(...serverHandlers);

beforeEach(() => {
  localStorage.clear();
  store.dispatch(initializeState());
  jest.spyOn(console, "error").mockImplementation(() => {});
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("register and success", async () => {
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>,
  );

  const emailInput = screen.getByLabelText("Email");
  fireEvent.change(emailInput, { target: { value: "test@test.com" } });
  const passwordInput = screen.getByLabelText("Password");
  fireEvent.change(passwordInput, { target: { value: "test@test.com" } });
  const usernameInput = screen.getByLabelText("Username");
  fireEvent.change(usernameInput, { target: { value: "test@test.com" } });

  fireEvent.click(screen.getByText("Submit"));

  await waitFor(() => screen.queryByText("Invalid username or password"));
  const nullText = screen.queryByText("Invalid username or password");
  await waitFor(() => expect(nullText).toBeNull());
  expect(store.getState().app.isAuthenticated).toBeTruthy();
  expect(localStorage.getItem("token")).not.toBeNull();
});

//TODO: server error
test("Should throw error", async () => {
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>,
  );

  server.use(
    rest.post(url + "/users", (_, res, ctx) => {
      return res(ctx.status(500));
    }),
  );

  const emailInput = screen.getByLabelText("Email");
  fireEvent.change(emailInput, { target: { value: "test@test.com" } });
  const passwordInput = screen.getByLabelText("Password");
  fireEvent.change(passwordInput, { target: { value: "test@test.com" } });

  fireEvent.click(screen.getByText("Submit"));

  await waitFor(() =>
    screen.getByText("invalid username or password", { exact: false })
  );
  const nullText = screen.getByText("invalid username or password", {
    exact: false,
  });
  await waitFor(() => expect(nullText).toBeVisible());
});

test("navigate to login page", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  const signUpLink = screen.getByText(/Sign up/);
  fireEvent.click(signUpLink, { button: 0 });
  let signInLink = screen.getByText(/Have an account?/);
  await waitFor(() => fireEvent.click(signInLink, { button: 0 }));
  await waitFor(() => expect(screen.getByText(/Sign In/)).toBeVisible());
});

test("entering text field value should match state", async () => {
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>,
  );

  const emailInput = screen.getByLabelText("Email");
  fireEvent.change(emailInput, { target: { value: "test@test.com" } });
  const passwordInput = screen.getByLabelText("Password");
  fireEvent.change(passwordInput, { target: { value: "test@test.com" } });
  const usernameInput = screen.getByLabelText("Username");
  fireEvent.change(usernameInput, { target: { value: "test@test.com" } });

  expect(store.getState().signUp.user.username).toMatch("test@test.com");
  expect(store.getState().signUp.user.password).toMatch("test@test.com");
  expect(store.getState().signUp.user.email).toMatch("test@test.com");
});

test("enter state should match text field value ", async () => {
  await waitFor(() =>
    store.dispatch(updateField({ name: "username", value: "1234" }))
  );
  await waitFor(() =>
    store.dispatch(updateField({ name: "password", value: "1234" }))
  );
  await waitFor(() =>
    store.dispatch(updateField({ name: "email", value: "1234" }))
  );

  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>,
  );

  const emailInput = screen.getByLabelText("Email");
  const passwordInput = screen.getByLabelText("Password");
  const usernameInput = screen.getByLabelText("Username");

  await waitFor(() => expect(emailInput).toHaveValue("1234"));
  await waitFor(() => expect(passwordInput).toHaveValue("1234"));
  await waitFor(() => expect(usernameInput).toHaveValue("1234"));
});

test("should reset state when navigating", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  const signInHeader = screen.getByText(/Sign up/);
  fireEvent.click(signInHeader, { button: 0 });

  const emailInput = screen.getByLabelText("Email");
  fireEvent.change(emailInput, { target: { value: "test@test.com" } });
  const passwordInput = screen.getByLabelText("Password");
  fireEvent.change(passwordInput, { target: { value: "test@test.com" } });
  const usernameInput = screen.getByLabelText("Username");
  fireEvent.change(usernameInput, { target: { value: "test@test.com" } });

  let signInLink = screen.getByText(/Have an account?/);
  fireEvent.click(signInLink, { button: 0 });

  let signUpLink = screen.getByText(/Need an account?/);
  fireEvent.click(signUpLink, { button: 0 });

  await waitFor(() => expect(screen.getByLabelText("Email")).toHaveValue(""));
  await waitFor(() =>
    expect(screen.getByLabelText("Username")).toHaveValue("")
  );
  await waitFor(() =>
    expect(screen.getByLabelText("Password")).toHaveValue("")
  );
});
