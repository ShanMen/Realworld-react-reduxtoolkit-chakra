import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate, useParams } from "react-router-dom";
import {
  editArticleAsync,
  initializeState,
} from "../ArticleEditor/ArticleEditor.slice";
import { CreateArticle } from "../../types/articles";
import ArticleEditor from "../ArticleEditor/ArticleEditor";

const EditArticle = () => {
  let { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { article } = useAppSelector((state) => state.articlePage);
  const { status, error } = useAppSelector((state) => state.articleEditor);

  React.useEffect(() => {
    return () => {
      dispatch(initializeState());
    };
  }, [dispatch]);

  const onFormSubmit = async (
    article: CreateArticle,
  ) => {
    try {
      let result = await dispatch(
        editArticleAsync({ article: article, slug: slug! }),
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
      editorTitle={"Edit Article"}
      onFormSubmit={onFormSubmit}
      status={status}
      error={error || ""}
      articleBody={article.body}
      articleTitle={article.title}
      articleTags={article.tagList?.join(",") || ""}
      articleDescription={article.description}
    />
  );
};

export default EditArticle;
