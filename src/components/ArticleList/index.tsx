import * as React from "react";
import { Box, Skeleton } from "@chakra-ui/react";
import { useAppSelector } from "../../store/hooks";
import { Article } from "../../types/articles";
import { ArticlePreview } from "../ArticlePreview";

const ArticleList = (props: ArticleListProps) => {
  const { articles } = props;
  const { status } = useAppSelector((state) => state.article);

  return (
    <Skeleton isLoaded={status === "succeeded"}>
      <Box>
        {articles.length === 0 ? <>No articles are here... yet.</> : (
          articles.map((article: Article, index: number) => {
            return (
              <ArticlePreview
                key={article.slug}
                slug={article.slug}
                index={index}
              />
            );
          })
        )}
      </Box>
    </Skeleton>
  );
};

type ArticleListProps = {
  articles: Article[];
};

export { ArticleList };
