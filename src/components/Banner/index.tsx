import { Box, Flex, Heading } from "@chakra-ui/react";

const Banner = ({
  headerText,
  subHeaderText,
  bgColor,
  alignItems,
  children,
}: BannerProps) => {
  let align = alignItems ?? "center";
  return (
    <Flex
      w="100%"
      flexDirection={"column"}
      alignItems={align}
      backgroundColor={bgColor ?? "green"}
      p={"10"}
    >
      <Heading color={"white"} size={"xl"}>
        {headerText}
      </Heading>
      <Heading mt={2} color={"white"} size={"md"}>
        {subHeaderText}
      </Heading>
      {children && <Box mt={4}>{children}</Box>}
    </Flex>
  );
};

type BannerProps = {
  headerText: string;
  subHeaderText?: string;
  bgColor?: string;
  alignItems?: "center" | "left";
  children?: React.ReactNode;
};

export { Banner };
