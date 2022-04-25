import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { App } from "../App/App";
import { BrowserRouter, MemoryRouter, useLocation } from "react-router-dom";
import { render } from "../../test-utils";
import store from "../../store/store";
import { initializeState } from "./App.slice";
import { initializeState as homeInitializeState } from "../Home/Home.slice";
import { initializeState as articlieListInitializeState } from "../../components/ArticleList/ArticleList.slice";
import dayjs from "dayjs";

const mockedUsedLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useLocation: () => mockedUsedLocation,
}));

const url = process.env.REACT_APP_API_HOST;

const handlers = [
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
];

const server = setupServer(...handlers);

beforeEach(() => {
  localStorage.clear();
  store.dispatch(initializeState());
  store.dispatch(articlieListInitializeState());
  store.dispatch(homeInitializeState());
  jest.spyOn(console, "error").mockImplementation(() => {});
});
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Should call get user profile when rendered with token in localStorage", async () => {
  localStorage.setItem("token", "test token");
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() => expect(store.getState().app.isAuthenticated).toBe(true));
  await waitFor(() => expect(screen.getByText("test username")).toBeVisible());
});

test("Should not be logged in if token is not present in Local Storage", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() => expect(store.getState().app.isAuthenticated).toBe(false));
  await waitFor(() =>
    expect(screen.queryByText("test username")).not.toBeInTheDocument()
  );
});

test("Should render tags", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() =>
    expect(screen.queryAllByText(/welcome|implementations|codebaseShow/))
      .toHaveLength(3)
  );
});

test("Should set default tab Global Feed", async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() => expect(screen.queryByText(/Global Feed/i)).toBeVisible());
  await waitFor(() =>
    expect(screen.queryByText(/Your Feed/i)).toHaveAttribute(
      "aria-selected",
      "false",
    )
  );
  await waitFor(() =>
    expect(screen.queryByText(/Global Feed/i)).toHaveAttribute(
      "aria-selected",
      "true",
    )
  );
  await waitFor(() =>
    expect(store.getState().home.selectedTab).toBe("Global Feed")
  );
});

test("Should have tab Your Feed for logged in user", async () => {
  localStorage.setItem("token", "test token");
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() => expect(screen.queryByText(/Global Feed/i)).toBeVisible());
  await waitFor(() => expect(screen.queryByText(/Your Feed/i)).toBeVisible());
  await waitFor(() =>
    expect(screen.queryByText(/Global Feed/i)).toHaveAttribute(
      "aria-selected",
      "true",
    )
  );
  await waitFor(() =>
    expect(store.getState().home.selectedTab).toBe("Global Feed")
  );
});

test("Should render article preview list", async () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  await waitFor(() =>
    expect(screen.getAllByRole("heading", { name: /hi|new post/ }))
      .toHaveLength(2)
  );
});

test("Should display correct favoritedCount", async () => {
  server.use(
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
              "favoritesCount": 1234,
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
  );

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "1234" })).toBeInTheDocument()
  );
});

test("Should render transparent background for unfavorited article", async () => {
  server.use(
    rest.get(url + "/articles", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          articles: [
            {
              "slug": "hi-35023",
              "title": "hi2",
              "description": "hi2",
              "body": "hi2",
              "tagList": [],
              "createdAt": "2022-04-13T08:13:37.553Z",
              "updatedAt": "2022-04-13T08:13:37.553Z",
              "favorited": false,
              "favoritesCount": 2345,
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
  );

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "2345" })).not.toHaveAttribute(
      "id",
      "favorited",
    )
  );
});

test("Should render background for favorited article", async () => {
  server.use(
    rest.get(url + "/articles", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          articles: [
            {
              "slug": "hi-35023",
              "title": "hi2",
              "description": "hi2",
              "body": "hi2",
              "tagList": [],
              "createdAt": "2022-04-13T08:13:37.553Z",
              "updatedAt": "2022-04-13T08:13:37.553Z",
              "favorited": true,
              "favoritesCount": 4567,
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
  );

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "4567" })).toHaveAttribute(
      "id",
      "favorited",
    )
  );
});

test("Should navigate to article page", async () => {
  const tempHandlers = [
    rest.get(url + "/articles", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          articles: [
            {
              "slug": "hi-35023",
              "title": "hi2",
              "description": "hi2",
              "body": "hi2",
              "tagList": [],
              "createdAt": "2022-04-13T08:13:37.553Z",
              "updatedAt": "2022-04-13T08:13:37.553Z",
              "favorited": true,
              "favoritesCount": 4567,
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
  ];

  server.use(...tempHandlers);

  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );

  await waitFor(() => screen.getByRole("link", { name: "Read more..." }));
  fireEvent.click(screen.getByRole("link", { name: "Read more..." }));
  expect(window.location.pathname).toBe("/article/hi-35023");
});

test("Should display correct article preview ", async () => {
  const article = {
    favouriteCount: 4567,
    title: "title",
    body: "hi2",
    description: "description",
    author: {
      username: "qqq123b",
    },
    createdDate: "2022-04-13T08:13:37.553Z",
  };

  const expectedDateTimeString = dayjs(article.createdDate).format(
    "ddd DD MMM YYYY",
  );

  server.use(
    rest.get(url + "/articles", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          articles: [
            {
              "slug": "hi-35023",
              "title": article.title,
              "description": article.description,
              "body": article.body,
              "tagList": ["articleTag", "articleTag2"],
              "createdAt": article.createdDate,
              "updatedAt": "2022-04-13T08:13:37.553Z",
              "favorited": true,
              "favoritesCount": article.favouriteCount,
              "author": {
                "username": article.author.username,
                "bio": null,
                "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
                "following": false,
              },
            },
          ],
        }),
      );
    }),
  );

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "4567" })).toBeInTheDocument();
    expect(screen.getByText(article.author.username)).toBeInTheDocument();
    expect(screen.getByText(article.title)).toBeInTheDocument();
    expect(screen.getByText(article.description)).toBeInTheDocument();
    expect(screen.getByText(expectedDateTimeString)).toBeInTheDocument();
    expect(screen.getAllByText(/articleTag|articleTag2/i)).toHaveLength(2);
  });
});

test("Should add new tab when clicking on tab (to filter by tags) ", async () => {
  const article = {
    favouriteCount: 4567,
    title: "title",
    body: "hi2",
    description: "description",
    author: {
      username: "qqq123b",
    },
    createdDate: "2022-04-13T08:13:37.553Z",
  };

  const expectedDateTimeString = dayjs(article.createdDate).format(
    "ddd DD MMM YYYY",
  );

  server.use(
    rest.get(url + "/articles", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          articles: [
            {
              "slug": "hi-35023",
              "title": article.title,
              "description": article.description,
              "body": article.body,
              "tagList": ["welcome"],
              "createdAt": article.createdDate,
              "updatedAt": "2022-04-13T08:13:37.553Z",
              "favorited": true,
              "favoritesCount": article.favouriteCount,
              "author": {
                "username": article.author.username,
                "bio": null,
                "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
                "following": false,
              },
            },
          ],
        }),
      );
    }),
  );

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  await waitFor(() => screen.getByRole("link", { name: "welcome" }));
  fireEvent.click(screen.getByRole("link", { name: "welcome" }));
  await waitFor(() => screen.getByRole("button", { name: "4567" }));
  expect(screen.getByRole("button", { name: "4567" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "#welcome" })).toBeInTheDocument();
  expect(screen.getByText(article.author.username)).toBeInTheDocument();
  expect(screen.getByText(article.title)).toBeInTheDocument();
  expect(screen.getByText(article.description)).toBeInTheDocument();
  expect(screen.getByText(expectedDateTimeString)).toBeInTheDocument();
  expect(screen.getAllByText("welcome")).toHaveLength(2);
});

test("Should remove custom tab when clicking on non custom tabs", async () => {
  const article = {
    favouriteCount: 4567,
    title: "title",
    body: "hi2",
    description: "description",
    author: {
      username: "qqq123b",
    },
    createdDate: "2022-04-13T08:13:37.553Z",
  };

  server.use(
    rest.get(url + "/articles", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          articles: [
            {
              "slug": "hi-35023",
              "title": article.title,
              "description": article.description,
              "body": article.body,
              "tagList": ["welcome"],
              "createdAt": article.createdDate,
              "updatedAt": "2022-04-13T08:13:37.553Z",
              "favorited": true,
              "favoritesCount": article.favouriteCount,
              "author": {
                "username": article.author.username,
                "bio": null,
                "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
                "following": false,
              },
            },
          ],
        }),
      );
    }),
  );

  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  await waitFor(() => screen.getByRole("link", { name: "welcome" }));
  fireEvent.click(screen.getByRole("link", { name: "welcome" }));
  await waitFor(() => screen.getByRole("button", { name: "4567" }));
  expect(screen.getByRole("tab", { name: "#welcome" })).toBeInTheDocument();
  fireEvent.click(screen.getByText("Global Feed"));
  expect(screen.getAllByRole("tab")).toHaveLength(1);
});
