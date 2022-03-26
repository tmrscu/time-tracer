import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabaseClient } from "../utils/client";
import styles from "../styles/Home.module.css";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

export default function Home() {
  const router = useRouter();
  const user = supabaseClient.auth.user();
  const [data, setData] = useState([]);
  const [taskType, setTaskType] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  // useEffect runs, pushes to signin page if no user
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    fetchData();
  }, []);

  // NEEEd tyhis data
  const fetchData = async () => {};

  // Returns an empty div if theres no user
  // Prevents page flash
  if (!user) {
    return <div></div>;
  }
  return (
    <div className={styles.container}>
      <Navbar />
      <Box color={"primary"}>HOMEPAGE</Box>
      <Box>{JSON.stringify(data)}</Box>
      <Box>{JSON.stringify(taskType)}</Box>
    </div>
  );
}
