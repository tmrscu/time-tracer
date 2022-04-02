import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabaseClient } from "../utils/client";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabaseClient.auth.signIn({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
          setEmail("");
          setPassword("");
        }, 3000);
      }
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
        setEmail("");
        setPassword("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      py="6"
      px={{ base: "4", lg: "8" }}
      bgGradient="linear(to-tr, #6772E5, rgb(112, 167, 248, 0.58))"
    >
      <Flex
        direction={{ base: "column", sm: "row" }}
        justify="space-between"
        alignItems="center"
        pb={12}
      >
        <Box>
          <Heading size="xl" mb={4}>
            Time Tracer
          </Heading>
        </Box>
        <Box>
          <Button
            bg="none"
            color="black"
            borderRadius={2}
            fontSize="md"
            mr={2}
            _hover={{ bg: "purple.500", color: "white" }}
          >
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </Button>
          <Button
            bg={"purple.400"}
            color="white"
            rounded="sm"
            borderRadius={2}
            fontSize="md"
            _hover={{ bg: "purple.500" }}
          >
            <Link href="/signin">
              <a>Sign In</a>
            </Link>
          </Button>
        </Box>
      </Flex>
      <Box maxW="md" mx="auto">
        {error && (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Text textAlign="center">{error}</Text>
          </Alert>
        )}
        <Box
          py="8"
          px={{ base: "4", md: "10" }}
          shadow="base"
          rounded="lg"
          bg="white"
        >
          <chakra.form onSubmit={submitHandler}>
            <Heading textAlign="center" mb={4}>
              Sign In
            </Heading>
            <Stack spacing="6">
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                bg="purple.400"
                color="white"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                _hover={{ bg: "purple.500" }}
              >
                Sign In
              </Button>
            </Stack>
            <Text textAlign={"center"} mt={6}>
              <Link href="/reset">
                <a>
                  <b>Forgot Password?</b>
                </a>
              </Link>
            </Text>
            <Text textAlign={"center"} mt={6}>
              Don&apos;t have an Account?
              <br />
              <Link href="/signup">
                <a>
                  <b>Sign Up</b>
                </a>
              </Link>
            </Text>
          </chakra.form>
        </Box>
      </Box>
    </Box>
  );
};

export default SignIn;
