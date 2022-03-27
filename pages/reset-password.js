import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import queryString from "query-string";
import { supabaseClient } from "../utils/client";
import {
  Container,
  Heading,
  Text,
  Alert,
  AlertIcon,
  chakra,
  Input,
  FormControl,
  FormLabel,
  Button,
} from "@chakra-ui/react";

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const accessToken = queryString.parse(router.asPath.split("#")[1]);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setIsError("Passwords do not match");
      setTimeout(() => {
        setIsError(null);
        setPassword("");
        setConfirmPassword("");
      }, 3000);
    }
    try {
      console.log("Trying Update");
      console.log(accessToken.access_token);
      const { error, data } = await supabaseClient.auth.api.updateUser(
        accessToken.access_token,
        { password: password }
      );
      if (error) {
        setIsError(error.message);
        setTimeout(() => {
          setIsError(null);
          setPassword("");
          setConfirmPassword("");
        }, 3000);
      } else {
        setIsSuccess(true);
        // sign user out supabase
        setTimeout(() => {
          supabaseClient.auth.signOut();
          // push user to signin page

          router.push("/signin");
        }, 3000);
      }
    } catch (error) {
      setIsError(error.message);
      setTimeout(() => {
        setIsError(null);
        setPassword("");
        setConfirmPassword("");
      }, 3000);
    }
  };
  return (
    <Container centerContent mt={16}>
      <Heading as="h1" textColor={"brand.text"}>
        Time Tracer
      </Heading>
      <Text textAlign={"center"} mt={8}>
        Change your password
      </Text>
      {isSuccess && (
        <Alert status="success" mt={6}>
          <AlertIcon />
          Password reset Succesfull
        </Alert>
      )}
      {isError && (
        <Alert status="error" mt={6}>
          <AlertIcon />
          There was an error processing your request
        </Alert>
      )}

      <chakra.form onSubmit={submitHandler} w="full" mt={6}>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="confirmPassword">
          <FormLabel>Confirm Password</FormLabel>
          <Input
            name="confirm_password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          bg="brand.primary"
          color="white"
          size="lg"
          fontSize="md"
          w="full"
          mt={6}
          _hover={{ bg: "purple.500" }}
        >
          Continue
        </Button>
      </chakra.form>
      <Text textAlign={"center"} mt={6}>
        Don&apos;t have an Account?
        <br />
        <Link href="/signup">
          <a>
            <b>Sign up</b>
          </a>
        </Link>
      </Text>
    </Container>
  );
};

export default ResetPassword;
