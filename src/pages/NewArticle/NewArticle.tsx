import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { newArticleAsync } from "../ArticleEditor/ArticleEditor.slice";
import { CreateArticle } from "../../types/articles";
import ArticleEditor from "../ArticleEditor/ArticleEditor";

const NewArticle = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.articleEditor);
  const navigate = useNavigate();

  const onFormSubmit = async (
    article: CreateArticle,
  ) => {
    try {
      // let newArticle = {
      //   title: articleTitle,
      //   description: articleDescription,
      //   body: articleBody,
      //   tagsList: articleTags,
      // } as CreateArticle;

      let result = await dispatch(
        newArticleAsync({ article: article }),
      ).unwrap();
      if (result) {
        navigate("/");
      }
    } catch (ex: any) {
      console.error(ex.message);
    }
  };

  return (
    <ArticleEditor
      onFormSubmit={onFormSubmit}
      status={status}
      error={error || ""}
    />
  );
};

export default NewArticle;
