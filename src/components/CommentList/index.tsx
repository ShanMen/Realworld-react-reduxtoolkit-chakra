import * as React from "react";
import { Box, Center } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Comment } from "../../types/articles";
import { Profile } from "../../types/user";
import { CommentBox, NewCommentBox } from "../../components/CommentBox";
import {
  deleteArticleCommentAsync,
  postArticleCommentAsync,
} from "../../pages/ArticlePage/ArticlePage.slice";

const CommentList = () => {
  const [comment, setComment] = React.useState("");
  const { comments, article } = useAppSelector(
    (state) => state.articlePage,
  );
  const { user } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const onTextBoxChange = (event: any) => {
    setComment(event.target.value);
  };

  const onCommentSubmit = (event: any) => {
    event.preventDefault();
    dispatch(
      postArticleCommentAsync({ slug: article.slug, comment: comment }),
    );
    setComment("");
  };

  const deleteComment = (commentId: number) => {
    dispatch(
      deleteArticleCommentAsync({ slug: article.slug, commentId: commentId }),
    );
  };

  let profile: Profile = {
    bio: "",
    email: "",
    username: user?.username || "",
    image: user?.image || "",
  };

  return (
    <Box py="6" as={Center}>
      <Box minW={{ base: "100%", md: "80%", xl: "60%" }}>
        <NewCommentBox
          value={comment}
          onChange={onTextBoxChange}
          onSubmit={onCommentSubmit}
          profile={profile}
        />
        {comments.length > 0 &&
          comments.map((comment: Comment) => {
            return (
              <CommentBox
                comment={comment}
                key={comment.id}
                onDeleteComment={deleteComment}
              />
            );
          })}
      </Box>
    </Box>
  );
};

export { CommentList };
