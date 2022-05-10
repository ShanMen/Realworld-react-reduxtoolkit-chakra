import * as React from "react";
import { Box, Container, Flex, Stack } from "@chakra-ui/react";
import { Banner } from "../../components/Banner";
import { CustomTabs } from "../../components/CustomTabs";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getTagsAsync,
  updateCustomTab,
  updateSelectedTab,
  updateTab,
} from "./Home.slice";
import { TagsPanel } from "../../components/TagsList";
import {
  getArticlesAsync,
  getFeedsAsync,
  selectAllArticles,
} from "../../components/ArticleList/ArticleList.slice";
import { ArticleList } from "../../components/ArticleList";

const Home = () => {
  const { isAuthenticated } = useAppSelector((state) => state.app);
  const { status, tabs, selectedTab } = useAppSelector((state) => state.home);
  const articles = useAppSelector((state) => selectAllArticles(state));
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

  React.useEffect(() => {
    if (selectedTab === "Your Feed") {
      dispatch(getFeedsAsync({}));
    } else if (selectedTab === "Global Feed") {
      dispatch(getArticlesAsync({}));
    } else {
      dispatch(getArticlesAsync({ tag: selectedTab }));
    }
  }, [selectedTab, dispatch, isAuthenticated]);

  const onTabsChange = async (index: number) => {
    let tabName = tabs.find((a) => a.tabIndex === index)?.tabTitle;
    if (index !== 2) {
      dispatch(updateCustomTab({
        tab: {
          isHidden: true,
        },
      }));
    }
    dispatch(updateSelectedTab({ tab: tabName! }));
  };

  let articlesPreview = <ArticleList articles={articles} />;

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
                tabs={tabs}
                onTabsChange={onTabsChange}
                selectedTab={selectedTab}
                children={articlesPreview}
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
