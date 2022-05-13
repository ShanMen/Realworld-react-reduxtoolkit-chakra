import * as React from "react";
import { Box, Image, Link, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Article } from "../../types/articles";
import { Profile } from "../../types/user";
import { Link as NavLink } from "react-router-dom";

const ArticleAuthor = React.memo((props: { article: Article }) => {
  return (
    <Box display="flex" flexDirection={"row"} alignItems={"center"}>
      <Image
        src={props.article.author.image || ""}
        boxSize="37px"
        borderRadius={"md"}
      />
      <Box ml="4">
        <Link
          as={NavLink}
          to={`/profile/${props.article.author.username}`}
          fontSize="16px"
          lineHeight={"16px"}
          color="green.500"
          fontWeight={"bold"}
        >
          {props.article.author.username}
        </Link>
        <Text
          fontWeight={"medium"}
          lineHeight={"normal"}
          fontSize="xs"
          color={"gray.500"}
        >
          {dayjs(props.article.createdAt).format("ddd DD MMM YYYY")}
        </Text>
      </Box>
    </Box>
  );
});

const CommentAuthor = React.memo(
  ({ author, createdAt }: { author: Profile; createdAt?: Date }) => {
    return (
      <Box display="flex" flexDirection={"row"}>
        <Image src={author.image || ""} boxSize="32px" borderRadius={"full"} />
        <Box ml="2">
          <Text
            fontSize="16px"
            lineHeight={"16px"}
            color="green.500"
            fontWeight={"bold"}
          >
            {author.username}
          </Text>
          <Text
            fontWeight={"medium"}
            lineHeight={"normal"}
            fontSize="xs"
            color={"gray.600"}
          >
            {createdAt != null && dayjs(createdAt).format("ddd DD MMM YYYY")}
          </Text>
        </Box>
      </Box>
    );
  },
);

export { ArticleAuthor, CommentAuthor };
