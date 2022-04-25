import * as React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { CreateArticle } from "../../types/articles";

const ArticleEditor = (props: IProps) => {
  const [articleTitle, setArticleTitle] = React.useState(
    props.articleTitle || "",
  );

  const [articleDescription, setArticleDescription] = React.useState(
    props.articleDescription || "",
  );

  const [articleBody, setArticleBody] = React.useState(props.articleBody || "");
  const [articleTags, setArticleTags] = React.useState(props.articleTags || "");

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let article = {
      title: articleTitle,
      body: articleBody,
      description: articleDescription,
      tagsList: articleTags,
    } as CreateArticle;
    props.onFormSubmit(article);
  };

  return (
    <Flex align={"center"} justify={"center"} w={"100%"}>
      <Stack
        mx={"auto"}
        w={{ base: "90%", md: "80%", lg: "60%" }}
        rounded={"xl"}
        boxShadow={"lg"}
        p="8"
      >
        <form onSubmit={onFormSubmit}>
          <Stack spacing={6} align="center">
            <FormControl>
              <FormLabel htmlFor="articleTitle">Article Title</FormLabel>
              <Input
                id="articleTitle"
                type="text"
                value={articleTitle}
                onChange={(event) => setArticleTitle(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="articleDescription">
                Article Description
              </FormLabel>
              <Input
                id="articleDescription"
                type="articleDescription"
                value={articleDescription}
                onChange={(event) => setArticleDescription(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="articleBody">Article Body</FormLabel>
              <Textarea
                id="articleBody"
                value={articleBody}
                onChange={(event) => setArticleBody(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="articleTags">Article Tags</FormLabel>
              <Input
                id="articleTags"
                type="articleTags"
                value={articleTags}
                onChange={(event) => setArticleTags(event.target.value)}
              />
            </FormControl>
            <Box>
              <Button
                type="submit"
                isLoading={props.status === "loading"}
                color="green.500"
                variant="outline"
              >
                Submit
              </Button>
            </Box>
            {props.status === "failed" && (
              <Text fontWeight="medium" color="red.500">
                Invalid username or password
              </Text>
            )}
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
};

export default ArticleEditor;

type IProps = {
  articleBody?: string;
  articleDescription?: string;
  articleTitle?: string;
  articleTags?: string;
  status?: string;
  onFormSubmit: (
    article: CreateArticle,
  ) => void;
  error?: string;
};
