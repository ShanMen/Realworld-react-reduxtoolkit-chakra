import * as React from "react";
import { Skeleton } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Article } from "../../types/articles";
import { ArticlePreview } from "../ArticlePreview";
import {
  getArticlesAsync,
  getFeedsAsync,
  selectAllArticles,
} from "./ArticleList.slice";

const ArticleList = () => {
  const dispatch = useAppDispatch();
  const { selectedTab } = useAppSelector((state) => state.home);
  const articles = useAppSelector((state) => selectAllArticles(state));
  const { status } = useAppSelector((state) => state.article);

  React.useEffect(() => {
    if (selectedTab === "Your Feed") {
      dispatch(getFeedsAsync({}));
    } else if (selectedTab === "Global Feed") {
      dispatch(getArticlesAsync({}));
    } else {
      dispatch(getArticlesAsync({ tag: selectedTab }));
    }
  }, [selectedTab, dispatch]);

  return (
    <Skeleton isLoaded={status === "succeeded"}>
      <div>
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
      </div>
    </Skeleton>
  );
};

export { ArticleList };
