import * as React from "react";
import {
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  Container,
  Heading,
  Link,
  Stack,
  Button,
  Box,
} from "@chakra-ui/react";
import { Link as NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateField, signUpAsync, initializeState } from "./SignUp.slice";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    return () => {
      dispatch(initializeState());
    };
  }, [dispatch]);

  const {
    user: { username, email, password },
    status,
    error,
  } = useAppSelector((state) => state.signUp);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let result = await dispatch(
        signUpAsync({ email, username, password })
      ).unwrap();
      if (result) {
        navigate("/");
      }
    } catch (ex: any) {
      console.error(ex.message);
    }
  };

  return (
    <>
      <Center>
        <Container>
          <Center mb="4">
            <Stack align="center">
              <Heading size="lg" color="green.500">
                Sign Up
              </Heading>
              <Link as={NavLink} to="/login" color="green.700">
                Have an account?
              </Link>
            </Stack>
          </Center>
          <form onSubmit={onFormSubmit}>
            <Stack spacing={6} align="center">
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) =>
                    dispatch(
                      updateField({
                        name: "username",
                        value: event.target.value,
                      })
                    )
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    dispatch(
                      updateField({
                        name: "email",
                        value: event.target.value,
                      })
                    )
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    dispatch(
                      updateField({
                        name: "password",
                        value: event.target.value,
                      })
                    )
                  }
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
              {error !== "" && error !== null && (
                <Text fontWeight="medium" color="red.500">
                  Invalid username or password
                </Text>
              )}
            </Stack>
          </form>
        </Container>
      </Center>
    </>
  );
};

export default SignUp;
