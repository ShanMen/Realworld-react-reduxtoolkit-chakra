import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignIn from "../SignIn/SignIn";
import { App } from "../App/App";
import { BrowserRouter } from "react-router-dom";
import { render } from "../../test-utils";
import store from "../../store/store";
import Settings from "./Settings";

const mockedUsedLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useLocation: () => mockedUsedLocation,
  axios: () => jest.fn(),
}));

let url = process.env.REACT_APP_API_HOST;

const serverHandlers = [
  rest.get(url + "/user", (_, res, ctx) => {
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
  rest.get(url + "/articles/hi-35023/comments", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        comments: [],
      }),
    );
  }),
  rest.get(url + "/articles/hi-35023", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        article: {
          "slug": "hi-35023",
          "title": "hi",
          "description": "hi",
          "body": "hi",
          "tagList": [],
          "createdAt": "2022-04-13T08:13:37.553Z",
          "updatedAt": "2022-04-13T08:13:37.553Z",
          "favorited": true,
          "favoritesCount": 1,
          "author": {
            "username": "qqq123b",
            "bio": null,
            "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
            "following": false,
          },
        },
      }),
    );
  }),
  rest.put(url + "/user", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          username: "test username2",
          email: "test email2",
          bio: "test user2",
          token: "test token2",
          image: "test image2",
        },
      }),
    );
  }),
];

const server = setupServer(...serverHandlers);

beforeEach(() => {
  localStorage.setItem("token", "test token");
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
//
test("Should load and set textbox values", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() => screen.getByRole("button", { name: "test username" }));
  fireEvent.click(screen.getByRole("button", { name: "test username" }));
  await waitFor(() => screen.getByRole("menuitem", { name: "Settings" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));
  await waitFor(() => {
    expect(screen.getByDisplayValue("test username")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test email")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test user")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test image")).toBeInTheDocument();
  });
}, 10000);

test("Should change text field ", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() => screen.getByRole("button", { name: "test username" }));
  fireEvent.click(screen.getByRole("button", { name: "test username" }));
  await waitFor(() => screen.getByRole("menuitem", { name: "Settings" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));

  fireEvent.change(screen.getByLabelText("Image URL"), {
    target: { value: "test image" },
  });
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "test username" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test email" },
  });
  fireEvent.change(screen.getByLabelText("Bio"), {
    target: { value: "test bio" },
  });

  await waitFor(() => {
    expect(screen.getByDisplayValue("test bio")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test username")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test image")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test email")).toBeInTheDocument();
  });
});

test("Should update user ", async () => {
  const user = {
    username: "test username2",
    token: "test token2",
    email: "test email2",
    bio: "test bio2",
    image: "test image2",
  };
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() => screen.getByRole("button", { name: "test username" }));
  fireEvent.click(screen.getByRole("button", { name: "test username" }));
  await waitFor(() => screen.getByRole("menuitem", { name: "Settings" }));
  fireEvent.click(screen.getByRole("menuitem", { name: "Settings" }));

  fireEvent.change(screen.getByLabelText("Image URL"), {
    target: { value: user.image },
  });
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: user.username },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: user.email },
  });
  fireEvent.change(screen.getByLabelText("Bio"), {
    target: { value: user.bio },
  });

  server.use(
    rest.get(url + "/user", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            token: user.token,
            image: user.image,
          },
        }),
      );
    }),
  );
  fireEvent.click(screen.getByText("Submit"));

  await waitFor(() => {
    expect(store.getState().app.user?.username).toBe(user.username);
    expect(store.getState().app.user?.email).toBe(user.email);
    expect(store.getState().app.user?.bio).toBe(user.bio);
    expect(store.getState().app.user?.image).toBe(user.image);
    expect(store.getState().app.user?.token).toBe(user.token);
  });
}, 10000);
