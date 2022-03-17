import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabaseClient } from "../utils/client";
import styles from "../styles/Home.module.css";
import { Box } from "@chakra-ui/react";

export default function Home() {
  const router = useRouter();
  const user = supabaseClient.auth.user();

  // useEffect runs, pushes to signin page if no user
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  // Returns an empty div if theres no user
  // Prevents page flash
  if (!user) {
    return <div></div>;
  }
  return (
    <div className={styles.container}>
      <Box color={"primary"}>HOMEPAGE</Box>
    </div>
  );
}
