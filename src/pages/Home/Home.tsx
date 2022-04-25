import * as React from "react";
import { Box, Container, Flex, Stack } from "@chakra-ui/react";
import { Banner } from "../../components/Banner";
import { CustomTabs } from "../../components/CustomTabs";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getTagsAsync, updateTab } from "./Home.slice";
import { TagsPanel } from "../../components/TagsList";

const Home = () => {
  const { isAuthenticated } = useAppSelector((state) => state.app);
  const { status, tabs } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (status === "idle") {
      dispatch(getTagsAsync());
    }
  }, [status, dispatch]);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(updateTab({
        tab: {
          tabTitle: "Your Feed",
          isHidden: false,
        },
      }));
    } else {
      dispatch(updateTab({
        tab: {
          tabTitle: "Your Feed",
          isHidden: true,
        },
      }));
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <Banner
        headerText="Conduit"
        subHeaderText="A place to share your knowledge"
        bgColor="green.400"
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
};

export default Home;
