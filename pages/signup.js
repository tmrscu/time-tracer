import Link from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  chakra,
  Flex,
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
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
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
      const { user, session, error } = await supabaseClient.auth.signUp(
        {
          email,
          password,
        },
        {
          data: {
            last_name: lname,
            first_name: fname,
            country: country,
            role: role,
            industry: industry,
          },
        }
      );
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

  const handleReset = () => {
    setFName("");
    setLName("");
    setCountry("");
    setRole("");
    setIndustry("");
    setEmail("");
    setPassword("");
  };

  return (
    <Box
      minH="100vh"
      py="6"
      px={{ base: "4", lg: "8" }}
      bgGradient="linear(to-tr, #6772E5, rgb(112, 167, 248, 0.58))"
    >
      <Flex justify="space-between" alignItems='center' pb={12}>
        <Box><Heading size='xl'>Time Tracer</Heading></Box>
        <Box>
          <Button
            border="1px"
            bg="none"
            color="black"
            borderRadius={2}
            fontSize="md"
            mr={2}
          >
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </Button>
          <Button
            border="1px"
            bg="none"
            color="black"
            borderRadius={2}
            fontSize="md"
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
          rounded={{ sm: "lg" }}
          bg="white"
          minW="600px"
        >
          {isSubmitted ? (
            <Heading size="md" textAlign="center" color="gray.600">
              Please check {email} for login link
            </Heading>
          ) : (
            <chakra.form onSubmit={submitHandler}>
              <Heading textAlign="center" m="6">
                Sign Up
              </Heading>
              <Text align="center" pb={6}>
                Sign Up for your free Time Tracer account
              </Text>
              <Stack spacing="3">
                <FormControl id="fname">
                  <FormLabel>
                    First Name{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    name="fname"
                    type="fname"
                    autoComplete="fname"
                    required
                    value={fname}
                    onChange={(e) => setFName(e.target.value)}
                  />
                </FormControl>
                <FormControl id="lname">
                  <FormLabel>
                    Last Name{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    name="lname"
                    type="lname"
                    autoComplete="lname"
                    required
                    value={lname}
                    onChange={(e) => setLName(e.target.value)}
                  />
                </FormControl>
                <FormControl id="country">
                  <FormLabel>
                    Country{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    name="country"
                    type="country"
                    autoComplete="country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </FormControl>
                <FormControl id="role">
                  <FormLabel>
                    Role{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    name="role"
                    type="role"
                    autoComplete="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </FormControl>
                <FormControl id="industry">
                  <FormLabel>
                    Industry{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    name="industry"
                    type="industry"
                    autoComplete="industry"
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </FormControl>
                <FormControl id="email">
                  <FormLabel>
                    Email Address{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
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
                  <FormLabel>
                    Password{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </FormLabel>
                  <Input
                    name="password"
                    type="password"
                    autoComplete="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Flex justify="space-between" gap={6}>
                  <Button
                    type="submit"
                    bg="purple.400"
                    color="white"
                    borderRadius={2}
                    fontSize="md"
                    flexGrow={1}
                    isLoading={isLoading}
                  >
                    Sign Up
                  </Button>
                  <Button
                    type="button"
                    bg="black"
                    color="white"
                    borderRadius={2}
                    fontSize="md"
                    flexGrow={1}
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </Flex>
              </Stack>
              <Text textAlign={'center'} mt={6}>
                Already have an account?{" "}
                <Link href="/signin">
                  <a><b>Sign In</b></a>
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
