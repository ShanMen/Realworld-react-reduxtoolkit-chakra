import * as React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { CreateArticle } from "../../types/articles";
import { useNavigate } from "react-router-dom";

const ArticleEditor = (props: IProps) => {
  const navigate = useNavigate();
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
    <Flex align={"center"} justify={"center"} w={"100%"} py="8">
      <Stack
        mx={"auto"}
        w={{ base: "90%", md: "80%", lg: "xl" }}
        rounded={"xl"}
        boxShadow={"lg"}
        p="8"
      >
        <Heading as={"h1"} size={"lg"} color={"green.500"} my="4">
          {props.editorTitle}
        </Heading>
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
            <Box w="full" display={"flex"} justifyContent={"end"}>
              <Button
                type="submit"
                loadingText={"Submitting..."}
                isLoading={props.status === "loading"}
                color="green.500"
                variant="outline"
              >
                Submit
              </Button>
              <Button
                ml={4}
                color="red.500"
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                Cancel
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
  editorTitle: string;
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
