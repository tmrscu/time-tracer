import Link from "next/link";
import {
  Box,
  Stack,
  Collapse,
  Text,
  Divider,
} from "@chakra-ui/react";

const MobileNavMenu = ({ isOpen, user, logout }) => {
  return (
    <Collapse
      style={{ width: "100%" }}
      display={{ base: "block", md: "none" }}
      in={isOpen}
      animateOpacity
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        width={{ base: "100%", md: "200px" }}
        display={{ base: "block", md: "none" }}
        alignItems="flex-start"
        flexGrow={1}
        mt={{ base: 4, md: 0 }}
        fontWeight={"bold"}
        ml={{ md: 18 }}
        spacing={{ base: 2, md: 6 }}
      >
        <Text
          my={2}
          fontSize="sm"
          fontWeight="400"
          color={"white"}
          display={{ md: "none" }}
        >
          Logged in as:{" "}
          <Text
            as="span"
            color={"white"}
          >{`${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`}</Text>
        </Text>
        <Text>
          <Link href={"/"}>
            <a>Timer</a>
          </Link>
        </Text>
        <Text>
          <Link href={"/clients"}>
            <a>Clients</a>
          </Link>
        </Text>
        <Text>
          <Link href={"/projects"}>
            <a>Projects</a>
          </Link>
        </Text>
        <Text>
          <Link href={"/tasks"}>
            <a>Tasks</a>
          </Link>
        </Text>
        <Box display={{ md: "none" }}>
          <Divider></Divider>
          <Text
            my={2}
            display={"inline-block"}
            onClick={logout}
            cursor="pointer"
          >
            Logout
          </Text>
          <Text>
            <Link href={"/profile"}>
              <a>Profile Settings</a>
            </Link>
          </Text>
        </Box>
      </Stack>
    </Collapse>
  );
};

export default MobileNavMenu;
