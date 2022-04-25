import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { User } from "../types/user";
import { GrArticle } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../pages/App/App.slice";

const Header = () => {
  const { user } = useAppSelector((state) => state.app);
  const isLoggedIn = user != null;

  return (
    <Flex w={{ base: "100%", "2xl": "65%" }} px="6" py="3">
      <Box p="2">
        <Heading to="/" as={Link} color="green.500" size="md">Conduit</Heading>
      </Box>
      <Spacer />
      <Flex p="2">
        <Link to="/">
          <Button colorScheme="teal" variant="link" mr="4">
            Home
          </Button>
        </Link>
        {!isLoggedIn ? <GuestLinks /> : <UserLinks user={user} />}
      </Flex>
    </Flex>
  );
};

const GuestLinks = () => {
  const location = useLocation();
  return (
    <>
      <Button
        as={NavLink}
        to="/login"
        colorScheme="teal"
        variant="link"
        mr="4"
        isActive={location.pathname === "/login"}
      >
        Sign in
      </Button>
      <Button
        as={NavLink}
        colorScheme="teal"
        variant="link"
        mr="4"
        to="/signup"
        isActive={location.pathname === "/signup"}
      >
        Sign up
      </Button>
    </>
  );
};

const UserLinks = ({ user }: { user: User }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        as={NavLink}
        colorScheme="teal"
        variant="link"
        leftIcon={<GrArticle color="teal" />}
        mr="4"
        to="/editor"
        isActive={location.pathname === "/editor"}
      >
        New Article
      </Button>
      <Menu>
        <MenuButton
          as={Button}
          colorScheme="teal"
          variant="link"
          leftIcon={
            <Image
              borderRadius="full"
              boxSize="26px"
              src={user.image || "test"}
            />
          }
          mr="4"
        >
          {user.username}
        </MenuButton>
        <MenuList>
          <MenuGroup title="Profile">
            <MenuItem as={Link} to="/profile">My Profile</MenuItem>
            <MenuItem as={Link} to="/settings">Settings</MenuItem>
            <MenuItem as={Link} to="/change-password">Change Password</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem
            onClick={() => {
              dispatch(logoutUser());
              navigate("/");
            }}
          >
            Log out
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default Header;
