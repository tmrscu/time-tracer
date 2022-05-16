import Link from "next/link";
import { Stack, Text } from "@chakra-ui/react";

// The desktop navmenu component
const NavMenu = () => {
  return (
    <Stack
      direction={"row"}
      display={{ base: "none", md: "flex" }}
      alignItems="flex-start"
      flexGrow={1}
      mt={2}
      fontWeight={"bold"}
      ml={18}
      spacing={6}
    >
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
    </Stack>
  );
};

export default NavMenu;
