import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { supabaseClient } from "../utils/client";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/Auth";
import {
  Container,
  Heading,
  Box,
  chakra,
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Flex,
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";

const Profile = ({ user }) => {
  const { setUser, user: userData } = useAuth();
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [countryOptions, setCountryOptions] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // On page load
  useEffect(() => {
    // Store user profile data locally
    const profileQueryData = getProfiles().then((results) => {
      setProfileData(results[0]);
      setFName(results[0].first_name);
      setLName(results[0].last_name);
      setEmail(results[0].email);
      setRole(results[0].role);
      setIndustry(results[0].industry);
      setCountry(results[0].country);
    });

    // Access the country data promise and store it locally
    const countryQueryData = getCountries().then((results) => {
      // Add country_names to the countryOptions array
      for (let i = 0; i < results.length; i++) {
        setCountryOptions((prevArray) => [
          ...prevArray,
          `${results[i].country_name}`,
        ]);
      }
    });
  }, []);

  // Get user profile data from Supabase
  const getProfiles = async () => {
    let { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("profile_id", user?.id);

    return data;
  };

  // Get Country data
  const getCountries = async () => {
    // Query Supabase for the country_name data
    // Order data alphabetically (a > z)
    let { data: countries, error } = await supabaseClient
      .from("countries")
      .select("country_name")
      .order("country_name", { ascending: true });

    // Returns a promise
    return countries;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({
          last_name: lname,
          first_name: fname,
          country: country,
          role: role,
          industry: industry,
        })
        .eq("profile_id", user?.id);
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
          setLName(profileData.last_name);
          setFName(profileData.first_name);
          setCountry(profileData.country);
          setRole(profileData.role);
          setIndustry(profileData.industry);
        }, 3000);
      }
      // if statement
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
        setLName(profileData.last_name);
        setFName(profileData.first_name);
        setCountry(profileData.country);
        setRole(profileData.role);
        setIndustry(profileData.industry);
      }, 3000);
    } finally {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      const profileQueryData = getProfiles().then((results) => {
        setProfileData(results[0]);
        // get the user data from supabase
      });
      // get access_token from local storage
      const localAuth = JSON.parse(localStorage.getItem("supabase.auth.token"));
      const { user: userDataNew, error } =
        await supabaseClient.auth.api.getUser(
          localAuth.currentSession.access_token
        );
      setUser(userDataNew);
    }
  };

  const deleteProfile = async () => {
    try {
      // Function to make the post request to delete a user
      await fetch("/api/deleteUser", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ userData }),
      });
      if (error) {
        setError(error.message);
      }
      // if statement
    } catch (error) {
      setError(error.message);
      console.log(error);
    } finally {
      // Push user to signin page
      router.push("/signin");
    }
    onClose();
  };

  if (fname == "") {
    return (
      <Box display="flex" justifyContent="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.primary"
          size="xl"
          mt={36}
          border
        />
      </Box>
    );
  }
  return (
    <div>
      <Navbar />
      <Container centerContent maxW="container.md" p={10} mt={12}>
        <Box w="full" mb={12}>
          <Heading as="h2" size="lg" textAlign="left">
            Edit Profile
          </Heading>
        </Box>
        {success && (
          <Alert status="success" mb="6">
            <AlertIcon />
            <Text textAlign="center">
              Your profile details were successfully updated.
            </Text>
          </Alert>
        )}
        <Box w="full">
          <chakra.form
            onSubmit={submitHandler}
            bg="white"
            rounded="lg"
            w="full"
          >
            <Stack spacing="3">
              <Flex direction={{ base: "column", md: "row" }} gap={6}>
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
              </Flex>
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
              <Flex direction={{ base: "column", md: "row" }} gap={6}>
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
              </Flex>
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
                  mb={6}
                >
                  <option key={country} value={country}>
                    {country}
                  </option>
                  {countryOptions.map((countries, index) => {
                    return (
                      <option key={index} value={countries}>
                        {countries}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <Button
                type="submit"
                bg="brand.primary"
                rounded="md"
                color="white"
                fontSize="lg"
                flexGrow={1}
                isLoading={isLoading}
                _hover={{ bg: "purple.600" }}
              >
                Save
              </Button>
            </Stack>
          </chakra.form>
          <AlertDialogExample
            deleteProfile={deleteProfile}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />
        </Box>
      </Container>
    </div>
  );
};

function AlertDialogExample({ deleteProfile, isOpen, onOpen, onClose }) {
  const cancelRef = useRef();

  return (
    <>
      <Button
        color="red.400"
        border="1px"
        bg="none"
        py={5}
        mt={6}
        onClick={onOpen}
        w={{ base: "full", md: "auto" }}
        _hover={{ bg: "red.400", color: "white" }}
      >
        Delete Profile
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Profile
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteProfile} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { user } = await supabaseClient.auth.api.getUserByCookie(req);

  if (!user) {
    return { props: {}, redirect: { destination: "/signin" } };
  }

  return { props: { user } };
}

export default Profile;
