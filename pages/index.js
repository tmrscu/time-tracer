
import { supabaseClient } from "../utils/client";
import StartTimer from "../components/StartTimer";
import { Box, Container } from "@chakra-ui/react";
import Header from "../components/Header";

export default function Home() {


  // The index page
  return (
    <Box bg="#f6f8fc" h="100vh">
      {/* border='1px' borderColor={'black'}  */}
      <Header />
      <Container maxW="6xl" pt={5}>
        <StartTimer />
      </Container>
    </Box>
  );
}
