import * as React from "react";
import { Box, Heading, Link, Skeleton, Stack, Tag } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  updateCustomTab,
  updateSelectedTab,
} from "../../pages/Home/Home.slice";

const TagsPanel = React.memo(() => {
  const { tags, status } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();

  const onTagsClick = (tagName: string) => {
    dispatch(updateCustomTab({
      tab: {
        tabTitle: tagName,
        isHidden: false,
      },
    }));
    dispatch(updateSelectedTab({ tab: tagName }));
  };

  return (
    <Box w="100%">
      <Skeleton isLoaded={status === "succeeded"}>
        <Stack bgColor={"gray.50"} p="4">
          <Heading size={"sm"}>Popular Tags</Heading>
          <TagsList tags={tags} onTagsClick={onTagsClick} />
        </Stack>
      </Skeleton>
    </Box>
  );
});

const TagsList = ({
  tags,
  onTagsClick,
}: {
  tags: string[];
  onTagsClick?: (tagName: string) => void;
}) => {
  let onClick = (e: any, tag: string) => {
    e.preventDefault();
    if (onTagsClick) onTagsClick(tag);
  };
  return (
    <div>
      {tags &&
        tags.map((tag: string) => {
          return (
            <Tag
              m="1"
              key={tag}
              onClick={(e) => onClick(e, tag)}
              cursor={onTagsClick ? "pointer" : "default"}
              as={Link}
              href="#"
            >
              {tag}
            </Tag>
          );
        })}
    </div>
  );
};

export { TagsList, TagsPanel };
