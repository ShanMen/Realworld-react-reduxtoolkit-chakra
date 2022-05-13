import * as React from "react";
import {
  Box,
  Container,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { Banner } from "../../components/Banner";
import { HiPencilAlt } from "react-icons/hi";
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
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

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
          alignItems={"left"}
        />
        <Container
          pt={8}
          maxW={{ base: "100%", md: "95%", "2xl": "65%" }}
          px="6"
        >
          <Box
            display={"flex"}
            flexDirection={"column"}
            bgColor={"white"}
            mt={-20}
            mb={14}
            px={8}
            pt={6}
            pb={10}
            borderRadius={"md"}
            boxShadow={"sm"}
            position={"relative"}
          >
            <Box position={"relative"}>
              {shouldDisplayEditArticleButtons && (
                <Box w={"auto"} position={"absolute"} top={0} right={0}>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Actions"
                      icon={<HiPencilAlt />}
                      variant={"outline"}
                    />
                    <MenuList>
                      <MenuItem
                        icon={<Icon as={AiOutlineEdit} w={4} h={4} />}
                        onClick={() =>
                          navigate("/editor/" + slug)}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={AiOutlineDelete} w={4} h={4} />}
                        onClick={deleteArticle}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              )}
              <Box display={"flex"} justifyContent={"space-between"}>
                <TagsList tags={article?.tagList || []} />
              </Box>
              <Heading mt={4} as={"h1"} fontSize={"xl"}>
                {article?.title}
              </Heading>
              <Box mt={4}>
                <ArticleAuthor article={article!}></ArticleAuthor>
              </Box>
              <Text mt={8} fontWeight={"medium"}>{article?.body}</Text>
            </Box>
          </Box>
          <hr />
          <Heading ml={8} my={8} as={"h1"} fontSize={"xl"}>Comments</Heading>
          <CommentList />
        </Container>
      </>
    );
  }

  return <>{content}</>;
};

export default ArticlePage;
