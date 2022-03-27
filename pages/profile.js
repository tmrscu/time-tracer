import { useState, useRef, useEffect } from "react";
import { supabaseClient } from "../utils/client";
import Navbar from "../components/Navbar";
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
  useFocusEffect,
} from "@chakra-ui/react";

const Profile = ({}) => {
  const user = supabaseClient.auth.user();
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [country, setCountry] = useState("");
  const [profileData, setProfileData] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Store user profile data locally
    const profileQueryData = getProfiles()
      .then((results) => {
        setProfileData(results[0]);
        setFName(results[0].first_name);
        setLName(results[0].last_name);
        setEmail(results[0].email);
        setRole(results[0].role);
        setIndustry(results[0].industry);
        setCountry(results[0].country);
      });
  },[]);

  // Get user profile data from Supabase
  const getProfiles = async () => {
    let { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('profile_id', user?.id);

    return data;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseClient.from('profiles')
        .update({ 
          last_name: lname, 
          first_name: fname, 
          country: country, 
          role: role, 
          industry: industry 
        })
        .eq('profile_id', user?.id);
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
    }
  };

  const deleteProfile = async () => {
    // TODO: DELETE USER - Supabase Query - Delete user from database
    console.log("DELETING");
    onClose();
  };

  return (
    <div>
      <Navbar />
      <Container centerContent maxW="container.md" p={10} mt={12}>
        <Box w="full" mb={12}>
          <Heading as="h2" size="lg" textAlign="left">
            Edit Profile
          </Heading>
        </Box>
        {error && (
          <Alert status="error" mb="6">
            <AlertIcon />
            <Text textAlign="center">{error}</Text>
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
                <Input
                  name="country"
                  type="country"
                  autoComplete="country"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  mb={6}
                />
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

export default Profile;
