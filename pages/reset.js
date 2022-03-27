import { useState } from "react";
import Link from "next/link";
import {
  Container,
  Heading,
  Text,
  chakra,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";
import { supabaseClient } from "../utils/client";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const { data, error } =
        await supabaseClient.auth.api.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
      if (error) {
        setIsError(error.message);
        console.log(error);
        // setTimeout(() => {
        //   setIsError(null);
        //   setEmail("");
        // }, 3000);
      } else {
        setIsLoading(false);
        setIsSuccess(true);
      }
    } catch (error) {
      setIsError(error.message);
      //   setTimeout(() => {
      //     setIsError(null);
      //     setEmail("");
      //   }, 3000);
      console.log(error);
    }
  };

  return (
    <Container centerContent mt={16}>
      {isLoading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.primary"
          size="xl"
          mt={20}
        />
      ) : (
        <>
          <Heading as="h1" textColor={"brand.text"}>
            Time Tracer
          </Heading>
          <Text textAlign={"center"} mt={8}>
            Enter the email address associated with your account
            <br />
            and we&apos;ll send you a link to reset your password
          </Text>
          {isSuccess && (
            <Alert status="success" mt={6}>
              <AlertIcon />
              Password reset email sent
            </Alert>
          )}
          {isError && (
            <Alert status="error" mt={6}>
              <AlertIcon />
              There was an error processing your request
            </Alert>
          )}

          <chakra.form onSubmit={submitHandler} w="full" mt={6}>
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
        </>
      )}
    </Container>
  );
};

export default Reset;
