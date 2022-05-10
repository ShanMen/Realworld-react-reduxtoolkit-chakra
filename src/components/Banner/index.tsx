import { Box, Container, Flex, Heading } from "@chakra-ui/react";

const Banner = ({
  headerText,
  subHeaderText,
  bgColor,
  alignItems,
  children,
}: BannerProps) => {
  let align = alignItems ?? "center";
  let optionalChildrenTopMargin = children ? 4 : 0;
  let optionalSubHeaderMargin = subHeaderText ? 2 : 0;

  return (
    <Flex
      w="100%"
      flexDirection={"column"}
      alignItems={align}
      backgroundColor={bgColor ?? "green"}
      px={2}
      py={10}
    >
      <Container
        maxW={{ base: "100%", md: "95%", "2xl": "65%" }}
        alignItems={align}
        display={"flex"}
        flexDirection={"column"}
      >
        <Heading color={"white"} size={"xl"} textAlign={alignItems}>
          {headerText}
        </Heading>
        <Heading mt={optionalSubHeaderMargin} color={"white"} size={"md"}>
          {subHeaderText}
        </Heading>
        {children && <Box mt={optionalChildrenTopMargin}>{children}</Box>}
      </Container>
    </Flex>
  );
};

type BannerProps = {
  headerText?: string;
  subHeaderText?: string;
  bgColor?: string;
  alignItems?: "center" | "left";
  children?: React.ReactNode;
};

export { Banner };
