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
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { UpdateUser } from "../../types/user";
import { initializeState, updateUserAsync } from "./Settings.slice";
import { getUserAsync } from "../App/App.slice";

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.settings);
  const [password, setPassword] = React.useState("");
  const [confirmationPassword, setConfirmationPassword] = React.useState("");
  const [localError, setLocalError] = React.useState("");

  React.useEffect(() => {
    return () => {
      initializeState();
    };
  }, []);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let user = {
        password,
      } as UpdateUser;
      await dispatch(updateUserAsync({ user: user }));
      await dispatch(getUserAsync());
    } catch (ex: any) {
      console.error(ex.message);
    }
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    let password = e.target.value;
    setPassword(e.target.value);
    if (confirmationPassword !== "" && password !== confirmationPassword) {
      setLocalError("Password doesn't match");
    } else if (password === confirmationPassword) {
      setLocalError("");
    }
  };

  const onChangeConfirmationPassword = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let confirmationPassword = e.target.value;
    setConfirmationPassword(e.target.value);
    if (password !== "" && password !== confirmationPassword) {
      setLocalError("Password doesn't match");
    } else if (password === confirmationPassword) {
      setLocalError("");
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
          Change Password
        </Heading>
        <form onSubmit={onFormSubmit}>
          <Stack spacing={6} align="center">
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => onChangePassword(event)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmationPassword">
                Confirm Password
              </FormLabel>
              <Input
                id="confirmationPassword"
                type="password"
                value={confirmationPassword}
                onChange={(event) => onChangeConfirmationPassword(event)}
              />
            </FormControl>
            <Box>
              <Button
                type="submit"
                isLoading={status === "loading"}
                color="green.500"
                variant="outline"
                disabled={localError !== ""}
              >
                Submit
              </Button>
            </Box>
            {status === "failed" && error !== "" && (
              <Text fontWeight="medium" color="red.500">
                {error || "Error processing request."}
              </Text>
            )}
            {localError !== "" && (
              <Text fontWeight="medium" color="red.500">
                {localError}
              </Text>
            )}
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
};

export default ChangePassword;
