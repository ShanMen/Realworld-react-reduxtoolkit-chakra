import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "./Profile";
import { BrowserRouter } from "react-router-dom";
import { render } from "../../test-utils";
import store from "../../store/store";
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
              "username": "test username",
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
              "username": "test username",
              "bio": null,
              "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
              "following": false,
            },
          },
        ],
      }),
    );
  }),
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

test("load user profile", async () => {
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>,
  );

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "test username" }))
      .toBeInTheDocument();
    expect(screen.getByRole("paragraph", { name: "test bio" }))
      .toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /hi|new post/ }))
      .toHaveLength(2);
  });
});

test("should navigate to profile settings when I click edit profile settings", async () => {
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>,
  );

  fireEvent.click(screen.getByText(/Edit Profile/i));

  await waitFor(() => {
    expect(window.location.pathname).toBe("/settings");
  });
});

test("should render MyArticles and FavoritedArticles", async () => {
  render(
    <BrowserRouter>
      <Profile />
    </BrowserRouter>,
  );

  await waitFor(() => expect(screen.queryByText(/My Articles/i)).toBeVisible());
  await waitFor(() =>
    expect(screen.queryByText(/Favourited Articles/i)).toHaveAttribute(
      "aria-selected",
      "false",
    )
  );
  await waitFor(() =>
    expect(screen.queryByText(/My Articles/i)).toHaveAttribute(
      "aria-selected",
      "true",
    )
  );
});
