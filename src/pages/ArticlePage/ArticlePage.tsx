import * as React from "react";
import { Box, Button, Container, Skeleton, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Banner } from "../../components/Banner";
import { ArticleAuthor } from "../../components/ArticleAuthor";
import { TagsList } from "../../components/TagsList";
import {
  deleteArticleAsync,
  getArticleAsync,
  getArticleCommentsAsync,
  initializeState,
} from "./ArticlePage.slice";
import { CommentList } from "../../components/CommentList";
import { batch } from "react-redux";

const ArticlePage = () => {
  let { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, article } = useAppSelector((state) => state.articlePage);
  const { user } = useAppSelector((state) => state.app);
  const shouldDisplayEditArticleButtons =
    user?.username === article?.author?.username;

  const deleteArticle = async () => {
    let result = await dispatch(deleteArticleAsync(slug!)).unwrap();
    if (result) {
      navigate("/");
    }
  };

  React.useEffect(() => {
    batch(() => {
      dispatch(getArticleAsync(slug!));
      dispatch(getArticleCommentsAsync(slug!));
    });

    //    dispatch(getArticleAsync(slug!))
    //      .unwrap()
    //      .then(() => {
    //       dispatch(getArticleCommentsAsync(slug!));
    //    });
    //
    return () => {
      dispatch(initializeState());
    };
  }, [slug, dispatch]);

  let content: React.ReactNode;
  if (status !== "succeeded") {
    content = <Skeleton h="200px"></Skeleton>;
  } else if (status === "succeeded") {
    content = (
      <>
        <Banner
          bgColor={"gray.700"}
          headerText={article?.title!}
          alignItems={"left"}
          children={
            <Box display={"flex"}>
              <ArticleAuthor article={article!}></ArticleAuthor>
              {shouldDisplayEditArticleButtons && (
                <>
                  <Button
                    variant={"solid"}
                    colorScheme={"green"}
                    ml={"4"}
                    onClick={() => navigate("/editor/" + slug)}
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    variant={"link"}
                    ml={"4"}
                    onClick={deleteArticle}
                    colorScheme="red"
                    size="sm"
                  >
                    Delete
                  </Button>
                </>
              )}
            </Box>
          }
        />
        <Container
          pt={8}
          maxW={{ base: "100%", md: "95%", "2xl": "65%" }}
          px="6"
        >
          <Text fontSize={"lg"}>{article?.body}</Text>
          <Box py="4" minH="80px">
            <TagsList tags={article?.tagList || []} />
          </Box>
          <hr />
          <CommentList />
        </Container>
      </>
    );
  }

  return <>{content}</>;
};

export default ArticlePage;
