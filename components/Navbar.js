import Link from "next/link";
import {
  Box,
  Heading,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Text,
  Divider,
} from "@chakra-ui/react";
import { supabaseClient } from "../utils/client";

const Navbar = () => {
  const user = supabaseClient.auth.user();

  // Supabase logout function
  const logout = () => {
    supabaseClient.auth.signOut();
  };

  console.log(user);
  return (
    <Box
      bg="brand.primary"
      color={"white"}
      display="flex"
      justifyContent={"space-between"}
      alignItems={"center"}
      px={12}
      py={5}
    >
      <Box>
        <Link href={"/"}>
          <a>
            <Heading as="h1" fontSize="2xl" color={"white"}>
              Time Tracer
            </Heading>
          </a>
        </Link>
      </Box>
      <HStack>
        <Box>
          <h2>Home</h2>
        </Box>
      </HStack>
      <Box>
        <Menu>
          <MenuButton>
            <Avatar
              name={`${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`}
              as={Button}
              src="https://bit.ly/broken-link"
            />
          </MenuButton>
          <MenuList color={"brand.text"}>
            <Text ml={3} mb={2} fontSize="sm" color={"gray.500"} border>
              Logged in as:{" "}
              <Text
                as="span"
                color={"gray.700"}
              >{`${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`}</Text>
            </Text>
            <Divider></Divider>
            <MenuItem _focus={{ bg: "purple.100" }} onClick={logout}>
              Logout
            </MenuItem>
            <MenuItem _focus={{ bg: "purple.100" }}>
              <Link href={"/profile"}>
                <a>Profile Settings</a>
              </Link>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
