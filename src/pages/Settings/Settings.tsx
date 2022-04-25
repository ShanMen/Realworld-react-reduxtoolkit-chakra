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
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { UpdateUser } from "../../types/user";
import { initializeState, updateUserAsync } from "./Settings.slice";
import { getUserAsync } from "../App/App.slice";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.app);
  const { status, error } = useAppSelector((state) => state.settings);
  const [profilePictureUrl, setProfilePictureUrl] = React.useState(
    user?.image || "",
  );
  const [username, setUsername] = React.useState(user?.username || "");
  const [bio, setBio] = React.useState(user?.bio || "");
  const [email, setEmail] = React.useState(user?.email || "");

  React.useEffect(() => {
    return () => {
      initializeState();
    };
  }, []);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let user = {
        username: username,
        bio: bio,
        email: email,
        image: profilePictureUrl,
      } as UpdateUser;
      await dispatch(updateUserAsync({ user: user }));
      await dispatch(getUserAsync());
    } catch (ex: any) {
      console.error(ex.message);
    }
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
          Settings
        </Heading>
        <form onSubmit={onFormSubmit}>
          <Stack spacing={6} align="center">
            <FormControl>
              <FormLabel htmlFor="profilePictureUrl">Image URL</FormLabel>
              <Input
                id="profilePictureUrl"
                type="text"
                value={profilePictureUrl}
                onChange={(event) => setProfilePictureUrl(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="username">
                Username
              </FormLabel>
              <Input
                id="username"
                type="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="bio">Bio</FormLabel>
              <Textarea
                id="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <Box>
              <Button
                type="submit"
                isLoading={status === "loading"}
                color="green.500"
                variant="outline"
              >
                Submit
              </Button>
            </Box>
            {status === "failed" && error !== "" && (
              <Text fontWeight="medium" color="red.500">
                {error || "Error processing request."}
              </Text>
            )}
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
};

export default Settings;
