import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabaseClient } from "../utils/client";
import TimerContainer from "../components/TimerContainer";
import { Box, Container } from "@chakra-ui/react";
import Header from "../components/Header";
import TimerItems from "../components/TimerItems";
import { useStopwatch } from "react-timer-hook";
import { getCurrentTime, getCurrentDate } from "../utils/timeAndDataHelpers";

export default function Home() {
  const [clientID, setClientID] = useState(null);
  const [projectID, setProjectID] = useState(null);
  const [taskTypeID, setTaskTypeID] = useState(null);
  const [entryNote, setEntryNote] = useState("");
  const [intervalID, setIntervalID] = useState(null);
  const [currentTrackingID, setCurrentTrackingID] = useState(null);
  const [taskTracking, setTaskTracking] = useState(null);

  const { start, reset, seconds, minutes, hours, isRunning } = useStopwatch({
    autoStart: false,
    precision: "seconds",
  });

  const [timer, setTimer] = useState({});
  const router = useRouter();
  const user = supabaseClient.auth.user();
  // useEffect runs, pushes to signin page if no user
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    getTaskTracking();
  }, []);

  // Returns an empty div if theres no user
  // Prevents page flash
  if (!user) {
    return <div></div>;
  }

  const startTimer = async () => {
    setCurrentTrackingID(null);
    // Insert a new project task and get the project task ID back
    const project_task_id = await insertProjectTask();

    // Send a request to the server to start the timer - get a response back with the task ID
    const tracking_id = await insertTaskTracking(project_task_id, entryNote);
    setCurrentTrackingID(tracking_id);

    // Set an interval to update the timer every minute
    const interval = setInterval(() => {
      updateTaskTracking(tracking_id);
    }, 60000);

    setIntervalID(interval);
    // Start the timer
    start();
  };

  const stopTimer = () => {
    // Send a request to the server to stop the task and update the duration
    updateTaskTracking(currentTrackingID);
    setCurrentTrackingID(null);

    // Clear the interval
    clearInterval(intervalID);
    setIntervalID(null);
    // reset the input
    setEntryNote("");
    // stop the timer
    reset(0, false);
    // update the state. make a request to get the finished tasks
  };

  // 1. Make a request which generates project_task_id
  const insertProjectTask = async () => {
    const { data, error } = await supabaseClient.from("project_tasks").insert({
      project_id: projectID,
      task_type_id: taskTypeID,
    });

    return data[0].project_task_id;
  };

  // 2. Do an insert on task tracking where we need to generate current date, time and use that new project_task_id from request 1
  const insertTaskTracking = async (project_task_id, entryNote) => {
    const { data, error } = await supabaseClient.from("task_tracking").insert({
      start_time: getCurrentTime(),
      project_task_id: project_task_id,
      date: getCurrentDate(),
      entry_notes: entryNote,
    });
    console.log("data", data);
    console.log("error", error);
    // 3. Receive back from number 2 request, the new task_tracking.ID
    return data[0].tracking_id;
  };

  // 4. Make insert requests every minute to update the end_time with the current time using the task_tracking.ID from request 3
  const updateTaskTracking = async (tracking_id) => {
    const { data, error } = await supabaseClient
      .from("task_tracking")
      .update({
        end_time: getCurrentTime(),
      })
      .eq("tracking_id", tracking_id);
    console.log("Updated data", data);
    console.log("error", error);
  };

  // get all the task_tracking data
  const getTaskTracking = async () => {
    const { data, error } = await supabaseClient
      .from("task_tracking")
      .select(`*, project_tasks (*, task_types (*))`)
      .order("start_time", { ascending: false });

    setTaskTracking(data);
  };

  // The index page
  return (
    <Box bg="#f6f8fc" h="100vh">
      {/* border='1px' borderColor={'black'}  */}
      <Header />
      <Container maxW="6xl" pt={5}>
        <TimerContainer
          seconds={seconds}
          minutes={minutes}
          hours={hours}
          startTimer={startTimer}
          stopTimer={stopTimer}
          isRunning={isRunning}
          clientID={clientID}
          projectID={projectID}
          taskTypeID={taskTypeID}
          setClientID={setClientID}
          setProjectID={setProjectID}
          setTaskTypeID={setTaskTypeID}
          entryNote={entryNote}
          setEntryNote={setEntryNote}
        />
        <TimerItems
          items={taskTracking}
          startTimer={startTimer}
          stopTimer={stopTimer}
          isRunning={isRunning}
          seconds={seconds}
          minutes={minutes}
          hours={hours}
        />
      </Container>
    </Box>
  );
}
