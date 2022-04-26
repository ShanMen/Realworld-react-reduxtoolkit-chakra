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
import { ArticleAuthor } from "../../components/ArticleAuthor";
import { TagsList } from "../../components/TagsList";
import { getMyArticles, getProfileByUsername } from "./Profile.slice";
import { batch } from "react-redux";

const Profile = () => {
  const dispatch = useAppDispatch();
  const { username } = useParams<{ username: string }>();
  const { status, profile } = useAppSelector((state) => state.profile);

  React.useEffect(() => {
    if (username) {
      batch(() => {
        dispatch(getProfileByUsername(username!));
        dispatch(getMyArticles(username!));
      });
    }
  }, []);

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
                <CustomTabs
                  tabs={{
                    tabs: tabs,
                    isAuthenticated: isAuthenticated,
                  }}
                />
              </Box>
            </Flex>
            <Flex flex={1}>
              <TagsPanel />
            </Flex>
          </Stack>
        </Container>
      </>
    );
  }

  return <>{content}</>;
};

export default Profile;
