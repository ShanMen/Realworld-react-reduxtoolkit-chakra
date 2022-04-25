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
      w="100%"
      borderTop={props.index !== 0 ? "1px" : ""}
      borderTopColor={"gray.300"}
      p="4"
      py="6"
    >
      <Box
        display="flex"
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <ArticleAuthor article={article!} />
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
      </Box>
      <Box mt={5}>
        <Heading
          as={NavLink}
          to={`/article/${article?.slug}`}
          color="green.500"
          size={"md"}
        >
          {article?.title}
        </Heading>
        <Text color={"gray.600"} fontSize="sm" isTruncated={true}>
          {article?.description}
        </Text>
      </Box>
      <Flex mt={4} justifyContent={"space-between"}>
        <Link as={NavLink} to={`/article/${article?.slug}`} fontSize="sm">
          Read more...
        </Link>
        <Box>
          {article?.tagList !== [] &&
            article?.tagList!.map((tag: string) => {
              return (
                <Tag m="1" key={tag}>
                  {tag}
                </Tag>
              );
            })}
        </Box>
      </Flex>
    </Box>
  );
};

export { ArticlePreview };
