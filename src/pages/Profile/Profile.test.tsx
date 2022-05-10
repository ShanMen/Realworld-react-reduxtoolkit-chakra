import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "./Profile";
import Settings from "../Settings/Settings";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render } from "../../test-utils";
import store from "../../store/store";
import { initializeState, loginUser } from "../App/App.slice";

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
              "username": "testusername",
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
              "username": "testusername",
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
          username: "testusername",
          email: "test email",
          bio: "test user",
          token: "test token",
          image: "test image",
        },
      }),
    );
  }),
  rest.get(url + "/profiles/testusername", (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        profile: {
          username: "testusername",
          email: "test email",
          bio: "test user",
          image: "test image",
          following: false,
        },
      }),
    );
  }),
];

const server = setupServer(...serverHandlers);

let renderProfile = (username = "testusername") => {
  render(
    <MemoryRouter initialEntries={[`/profile/${username}`]}>
      <Routes>
        <Route path="profile/:username" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </MemoryRouter>,
  );
};

beforeEach(() => {
  localStorage.clear();
  store.dispatch(initializeState());
  store.dispatch(loginUser({
    username: "testusername",
    email: "test email",
    bio: "test user",
    token: "test token",
    image: "test image",
  }));
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("load user profile", async () => {
  renderProfile();

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: "testusername" }))
      .toBeInTheDocument();
    expect(screen.getByText("test user"))
      .toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /hi|new post/ }))
      .toHaveLength(2);
  });
});

test("should navigate to profile settings when I click edit profile settings", async () => {
  renderProfile();

  await waitFor(() => {
    fireEvent.click(screen.getByText(/Edit Profile/i));
  });

  await waitFor(() => {
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});

test("should render MyArticles and FavoritedArticles", async () => {
  renderProfile();

  await waitFor(() => expect(screen.getByText(/My Articles/i)).toBeVisible());

  await waitFor(() =>
    expect(screen.getByText(/Favorited Articles/i)).toHaveAttribute(
      "aria-selected",
      "false",
    )
  );
  await waitFor(() =>
    expect(screen.getByText(/My Articles/i)).toHaveAttribute(
      "aria-selected",
      "true",
    )
  );
});

test("should render follow button when is not following", async () => {
  const usernameToRender = "nottestusername";
  server.use(
    rest.get(url + "/profiles/" + usernameToRender, (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          profile: {
            username: "nottestusername",
            email: "test email",
            bio: "test user",
            image: "test image",
            following: false,
          },
        }),
      );
    }),
  );
  renderProfile(usernameToRender);

  await waitFor(() => expect(screen.getByText(/Follow/i)).toBeVisible());
});

test("should render unfollow button when is following", async () => {
  const usernameToRender = "nottestusername";
  server.use(
    rest.get(url + "/profiles/" + usernameToRender, (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          profile: {
            username: "nottestusername",
            email: "test email",
            bio: "test user",
            image: "test image",
            following: true,
          },
        }),
      );
    }),
  );
  renderProfile(usernameToRender);

  await waitFor(() => expect(screen.getByText(/Unfollow/i)).toBeVisible());
});

test("should follow user", async () => {
  const usernameToRender = "nottestusername";
  server.use(
    rest.get(url + "/profiles/" + usernameToRender, (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          profile: {
            username: "nottestusername",
            email: "test email",
            bio: "test user",
            image: "test image",
            following: false,
          },
        }),
      );
    }),
  );

  server.use(
    rest.post(
      url + "/profiles/" + usernameToRender + "/follow",
      (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            profile: {
              username: "nottestusername",
              email: "test email",
              bio: "test user",
              image: "test image",
              following: true,
            },
          }),
        );
      },
    ),
  );

  renderProfile(usernameToRender);

  await waitFor(() => fireEvent.click(screen.getByText(/Follow/i)));

  await waitFor(() => expect(screen.getByText(/Unfollow/i)).toBeVisible());
});

test("should unfollow user", async () => {
  const usernameToRender = "nottestusername";
  server.use(
    rest.get(url + "/profiles/" + usernameToRender, (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          profile: {
            username: "nottestusername",
            email: "test email",
            bio: "test user",
            image: "test image",
            following: true,
          },
        }),
      );
    }),
  );

  server.use(
    rest.delete(
      url + "/profiles/" + usernameToRender + "/follow",
      (_, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            profile: {
              username: "nottestusername",
              email: "test email",
              bio: "test user",
              image: "test image",
              following: false,
            },
          }),
        );
      },
    ),
  );
  renderProfile(usernameToRender);

  await waitFor(() => fireEvent.click(screen.getByText(/Unfollow/i)));

  await waitFor(() => expect(screen.getByText(/Follow/i)).toBeVisible());
});

test("should render favorited articles", async () => {
  server.use(
    rest.get(url + "/articles", (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          articles: [
            {
              "slug": "hi-35023",
              "title": "favourited 1",
              "description": "favourited 1",
              "body": "favourited 1",
              "tagList": [],
              "createdAt": "2022-04-13T08:13:37.553Z",
              "updatedAt": "2022-04-13T08:13:37.553Z",
              "favorited": false,
              "favoritesCount": 1,
              "author": {
                "username": "testusername",
                "bio": null,
                "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
                "following": false,
              },
            },
            {
              "slug": "NEw-post-35023",
              "title": "favourited 2",
              "description": "favourited 2",
              "body": "favourited 2",
              "tagList": [],
              "createdAt": "2022-04-08T09:02:41.218Z",
              "updatedAt": "2022-04-08T09:02:56.766Z",
              "favorited": false,
              "favoritesCount": 0,
              "author": {
                "username": "testusername",
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
  renderProfile();

  await waitFor(() => fireEvent.click(screen.getByText(/Favorited Articles/i)));

  expect(screen.getAllByRole("link", { name: /favourited 1|favourited 2/ }))
    .toHaveLength(2);
});
