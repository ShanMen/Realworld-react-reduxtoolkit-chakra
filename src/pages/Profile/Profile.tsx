import * as React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CustomTabs } from "../../components/CustomTabs";
import { useNavigate, useParams } from "react-router-dom";
import { Banner } from "../../components/Banner";
import {
  followUserAsync,
  getProfileByUsername,
  unfollowUserAsync,
  updateSelectedTab,
} from "./Profile.slice";
import {
  getFavouritedArticles,
  getMyArticles,
  selectAllArticles,
} from "../../components/ArticleList/ArticleList.slice";
import { ArticleList } from "../../components/ArticleList";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const { user } = useAppSelector((state) => state.app);
  const { status, followStatus, profile, tabs, selectedTab } = useAppSelector((
    state,
  ) => state.profile);
  const articles = useAppSelector((state) => selectAllArticles(state));
  const shouldShowEditProfile = username === user?.username;
  const isFollowingUser = profile.following;

  let followUnfollowButton = isFollowingUser
    ? (
      <Button
        colorScheme={"green"}
        variant={"outline"}
        isLoading={followStatus === "loading"}
        loadingText={"Unfollowing..."}
        shadow={"md"}
        my="2"
        onClick={() => dispatch(unfollowUserAsync(username!))}
      >
        Unfollow
      </Button>
    )
    : (
      <Button
        colorScheme={"green"}
        variant={"outline"}
        isLoading={followStatus === "loading"}
        loadingText={"Following..."}
        shadow={"md"}
        my="2"
        onClick={() => dispatch(followUserAsync(username!))}
      >
        Follow
      </Button>
    );

  React.useEffect(() => {
    if (username) {
      dispatch(getProfileByUsername(username!));
    }
  }, [username, dispatch]);

  React.useEffect(() => {
    if (username) {
      if (selectedTab === "My Articles") {
        dispatch(getMyArticles(username!));
      } else if (selectedTab === "Favorited Articles") {
        dispatch(getFavouritedArticles(username!));
      }
    }
  }, [selectedTab, dispatch]);

  const onTabsChange = (index: number) => {
    let tabName = tabs.find((a) => a.tabIndex === index)?.tabTitle;
    dispatch(updateSelectedTab({ tab: tabName! }));
  };

  let children = <ArticleList articles={articles} />;

  let content: React.ReactNode;
  if (status !== "succeeded") {
    content = <Skeleton h="200px"></Skeleton>;
  } else if (status === "succeeded") {
    content = (
      <>
        <Banner
          bgColor={"gray.100"}
          alignItems={"center"}
          children={
            <Container
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Image
                borderRadius="full"
                boxSize="70px"
                src={profile.image || "test"}
              />
              <Heading color={"green.500"} as={"h1"} mt={2}>
                {profile.username}
              </Heading>
              <Text mt={2} fontWeight={"medium"} fontSize={"md"}>
                {profile.bio || " "}
              </Text>
              {shouldShowEditProfile
                ? (
                  <Button
                    colorScheme={"green"}
                    variant={"outline"}
                    shadow={"md"}
                    my="2"
                    onClick={() => navigate("/settings")}
                  >
                    Edit Profile
                  </Button>
                )
                : followUnfollowButton}
            </Container>
          }
        />
        <Container
          mt={4}
          maxW={{ base: "100%", md: "95%", "2xl": "65%" }}
          p={{ base: "0" }}
        >
          <Stack direction={{ base: "column", md: "row" }}>
            <Flex flex={3} minH="50vh">
              <Box w="100%">
                {
                  <CustomTabs
                    tabs={tabs}
                    onTabsChange={onTabsChange}
                    selectedTab={selectedTab}
                    children={children}
                  />
                }
              </Box>
            </Flex>
          </Stack>
        </Container>
      </>
    );
  }

  return <>{content}</>;
};

export default Profile;
