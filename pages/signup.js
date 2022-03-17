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
} from "@chakra-ui/react";
import { useState } from "react";
import { supabaseClient } from "../utils/client";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { user, session, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setIsSubmitted(true);
        router.push("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeHandler = (event) => {
    setEmail(event.target.value);
  };

  return (
    <Box minH="100vh" py="12" px={{ base: "4", lg: "8" }} bg="gray.50">
      <Box maxW="md" mx="auto">
        <Heading textAlign="center" m="6">
          Sign Up
        </Heading>
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
          rounded={{ sm: "lg" }}
          bg="white"
        >
          {isSubmitted ? (
            <Heading size="md" textAlign="center" color="gray.600">
              Please check {email} for login link
            </Heading>
          ) : (
            <chakra.form onSubmit={submitHandler}>
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
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </Stack>
              <Text>
                Already have an account?
                <Link href="/signin">
                  <a>Sign In</a>
                </Link>
              </Text>
            </chakra.form>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;