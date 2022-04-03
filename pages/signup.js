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
  Select,
  Stack,
  Text,
  Container,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";

const SignUp = () => {
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // On page load
  useEffect(() => {
    // Access the country data promise and store it locally
    const countryQueryData = getCountries().then((results) => {
      // Add country_names to the countryOptions array
      for (let i = 0; i < results.length; i++) {
        setCountryOptions(prevArray => [...prevArray, `${results[i].country_name}`]);
      }
    });
  }, []);

  // Get Country data
  const getCountries = async () => {
    // Query Supabase for the country_name data
    // Order data alphabetically (a > z)
    let { data: countries, error } = await supabaseClient
      .from('countries')
      .select('country_name')
      .order('country_name', { ascending: true });

    // Returns a promise
    return countries;
  }

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
            bg={"purple.400"}
            color="white"
            rounded="sm"
            borderRadius={2}
            fontSize="md"
            mr={2}
            _hover={{ bg: "purple.500" }}
          >
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </Button>
          <Button
            bg="none"
            color="black"
            borderRadius={2}
            fontSize="md"
            _hover={{ bg: "purple.500", color: "white" }}
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
        <Container centerContent p={0}>
          <chakra.form
            onSubmit={submitHandler}
            bg="white"
            p={6}
            rounded="lg"
            w={{ base: "full", md: "2xl" }}
          >
            <Heading textAlign="center" mb={4}>
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
                <Select
                  name="country"
                  type="country"
                  autoComplete="country"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {countryOptions.map(countries => {
                    return <option key={countries} value={countries}>{countries}</option>;
                  })}
                </Select>
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
                  _hover={{ bg: "purple.500" }}
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
                  _hover={{ bg: "gray.500" }}
                >
                  Reset
                </Button>
              </Flex>
            </Stack>
            <Text textAlign={"center"} mt={6}>
              Already have an account?
              <br />
              <Link href="/signin">
                <a>
                  <b>Sign In</b>
                </a>
              </Link>
            </Text>
          </chakra.form>
        </Container>
      </Box>
    </Box>
  );
};

export default SignUp;
