import * as React from "react";
import {
  Box,
  Button,
  IconButton,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Comment } from "../../types/articles";
import { Profile } from "../../types/user";
import { CommentAuthor } from "../ArticleAuthor";
import { AiFillDelete } from "react-icons/ai";
import { useAppSelector } from "../../store/hooks";

const CommentBox = React.memo(
  ({
    onDeleteComment,
    comment,
  }: {
    onDeleteComment: (commentId: number) => void;
    comment: Comment;
  }) => {
    const { user } = useAppSelector((state) => state.app);
    const shouldHideDeleteCommentButton =
      comment.author.username !== user?.username;
    return (
      <Box borderRadius={"md"} border={"1px"} borderColor={"gray.300"} my={4}>
        <Box display={"flex"} flexDirection={"column"}>
          <Box py={8} px={8}>
            <Text fontSize={"md"} fontWeight={"500"}>
              {comment.body}
            </Text>
          </Box>
          <Spacer />
          <Box
            bgColor={"gray.200"}
            p={4}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <CommentAuthor
              author={comment.author}
              createdAt={comment.createdAt}
            />
            <IconButton
              hidden={shouldHideDeleteCommentButton}
              variant="ghost"
              color="green.600"
              aria-label="Delete comment"
              icon={<AiFillDelete />}
              onClick={() =>
                onDeleteComment(comment.id)}
            />
          </Box>
        </Box>
      </Box>
    );
  },
);

const NewCommentBox = ({
  profile,
  value,
  onChange,
  onSubmit,
}: {
  profile: Profile;
  value: string;
  onChange: (event: any) => void;
  onSubmit: (event: any) => void;
}) => {
  const { commentStatus } = useAppSelector((state) => state.articlePage);
  return (
    <Box borderRadius={"md"} border={"1px"} borderColor={"gray.300"} my={4}>
      <Box display={"flex"} flexDirection={"column"}>
        <Box>
          <Textarea value={value} onChange={onChange} border={""} />
        </Box>
        <Spacer />
        <Box
          bgColor={"gray.200"}
          p={4}
          display={"flex"}
          justifyContent={"space-between"}
        >
          <CommentAuthor author={profile} />
          <Button
            size="sm"
            variant={"outline"}
            colorScheme="green"
            onClick={onSubmit}
            loadingText={"Submitting..."}
            isLoading={commentStatus === "loading"}
          >
            Post Comment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export { CommentBox, NewCommentBox };
