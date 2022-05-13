import { Box, Button, Flex, Heading, Link, Tag, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import {
  favoriteArticleAsync,
  selectArticleById,
  unfavoriteArticleAsync,
} from "../ArticleList/ArticleList.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { BsHeart } from "react-icons/bs";
import { ArticleAuthor } from "../ArticleAuthor";
import { Article } from "../../types/articles";

const ArticlePreview = (props: { slug: string; index: number }) => {
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) =>
    selectArticleById(state, props.slug)
  );

  const onFavoriteButtonClick = (article: Article) => {
    if (article!.favorited) {
      dispatch(unfavoriteArticleAsync({ slug: article.slug }));
    } else {
      dispatch(favoriteArticleAsync({ slug: article.slug }));
    }
  };

  return (
    <Box
      w="auto"
      p="6"
      bg="gray.50"
      py="6"
      m={4}
      rounded={"lg"}
      boxShadow={"sm"}
    >
      <Heading
        as={NavLink}
        to={`/article/${article?.slug}`}
        color="gray.900"
        size={"md"}
        fontWeight={"bold"}
      >
        {article?.title}
      </Heading>
      <Box
        mt={3}
        display="flex"
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <ArticleAuthor article={article!} />
        <Box>
          {article?.tagList !== [] &&
            article?.tagList!.map((tag: string) => {
              return (
                <Tag p={2} m="1" key={tag}>
                  {tag}
                </Tag>
              );
            })}
        </Box>
      </Box>
      <Box mt={5}>
        <Text color={"gray.600"} fontSize="sm" isTruncated={true}>
          {article?.description}
        </Text>
      </Box>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Link as={NavLink} to={`/article/${article?.slug}`} fontSize="sm">
          Read more...
        </Link>
        <Box>
          <Button
            colorScheme={"green"}
            id={article!.favorited ? "favorited" : ""}
            size="sm"
            variant={article!.favorited ? "solid" : "outline"}
            leftIcon={<BsHeart />}
            onClick={() => onFavoriteButtonClick(article!)}
          >
            {article?.favoritesCount || 0}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export { ArticlePreview };
