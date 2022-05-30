import { Box, Text, Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import TimerStartBtn from "./TimerStartBtn";
import Timer from "./Timer";
import { useStopwatch } from "react-timer-hook";
import { supabaseClient } from "../utils/client";
import { formatTime } from "./TimerContainer";
import { getCurrentTime, getCurrentDate } from "../utils/timeAndDataHelpers";
import EditTimerModal from "./EditTimerModal";

// Map over time duration 00:00:00 and return the hours, minutes, and seconds of all added up
const calcLength = (items) => {
  // sum a string of time durations
  const sum = (acc, item) => {
    const [h, m, s] = item.duration.split(":");
    const totalSeconds = parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
    return acc + totalSeconds;
  };
  // convert seconds to hours, minutes, and seconds
  const convert = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const secondsLeft = seconds - hours * 3600 - minutes * 60;
    return { hours, minutes, seconds: secondsLeft };
  };
  // return the sum of all durations
  const totalSeconds = items.reduce(sum, 0);
  // return the hours, minutes, and seconds of all added up in a string
  const sumTime = convert(totalSeconds);

  return sumTime.hours + ":" + sumTime.minutes + ":" + sumTime.seconds;
};

const TimerRow = ({ item, index, getTaskTracking }) => {
  const [intervalID, setIntervalID] = useState(null);
  const [currentTrackingID, setCurrentTrackingID] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dateCheck1 = new Date(item.date).toLocaleDateString();
  const dateCheck2 = new Date(getCurrentDate()).toLocaleDateString();
  const stopwatchOffset = new Date();
  stopwatchOffset.setSeconds(
    stopwatchOffset.getSeconds() +
      parseInt(item.duration.substring(0, 2)) * 60 * 60 +
      parseInt(item.duration.substring(3, 5)) * 60 +
      parseInt(item.duration.substring(6, 8))
  );

  const { start, pause, seconds, minutes, hours, isRunning } = useStopwatch({
    autoStart: false,
    precision: "seconds",
    offsetTimestamp: stopwatchOffset,
  });

  const startTimer = async () => {
    // setCurrentTrackingID(null);
    // setCurrentTrackingID(item.tracking_id);

    // Set an interval to update the timer every minute
    const interval = setInterval(() => {
      updateTaskTracking(tracking_id);
    }, 60000);
    setIntervalID(interval);

    // Start the timer
    start();
  };

  // 4. Make insert requests every minute to update the end_time with the current time using the task_tracking.ID from request 3
  const updateTaskTracking = async (tracking_id) => {
    // Build time entry
    const startHours = parseInt(item.start_time.substring(0, 2));
    const startMinutes = parseInt(item.start_time.substring(3, 5));
    const startSeconds = parseInt(item.start_time.substring(6, 8));

    const endTimeSeconds = new Date();
    endTimeSeconds.setSeconds(hours * 60 * 60 + minutes * 60 + seconds);

    const tempEndTime = convert(endTimeSeconds.getSeconds());
    let endHours = startHours + tempEndTime.hours;
    let endMinutes = startMinutes + tempEndTime.minutes;
    let endSeconds = startSeconds + tempEndTime.seconds;

    console.log(tempEndTime);

    if (startSeconds + tempEndTime.seconds > 59) {
      endSeconds = startSeconds + tempEndTime.seconds - 60;
      endMinutes = startMinutes + tempEndTime.minutes + 1;
    }
    if (endMinutes + tempEndTime.minutes > 59) {
      endMinutes = startMinutes + tempEndTime.minutes - 60;
      endHours = startHours + tempEndTime.hours + 1;
    }

    const endTime = `${endHours}:${endMinutes}:${endSeconds}`;
    console.log(item.start_time);
    console.log(endTime);

    const { data, error } = await supabaseClient
      .from("task_tracking")
      .update({
        end_time: endTime,
      })
      .eq("tracking_id", tracking_id);
    if (!error) {
      console.log("Updated data", data);
      // get all data from the database
      getTaskTracking();
    } else {
      console.log(error);
    }
  };

  const stopTimer = () => {
    // Send a request to the server to stop the task and update the duration
    updateTaskTracking(item.tracking_id);
    // setCurrentTrackingID(null);

    // Clear the interval
    clearInterval(intervalID);
    // setIntervalID(null);

    // Stop the timer
    pause(); // Pause timer
  };

  // convert seconds to hours, minutes, and seconds
  const convert = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const secondsLeft = seconds - hours * 3600 - minutes * 60;
    return { hours, minutes, seconds: secondsLeft };
  };

  return (
    <Flex
      justify={"space-between"}
      alignItems={"center"}
      key={index}
      borderBottom={"1px"}
      borderColor={"#ccc"}
      _last={{ borderBottom: "none" }}
      py={2}
    >
      <EditIcon mr={3} onClick={onOpen} cursor={"pointer"} />
      <Text width={"calc(100% - 20% - 60px - 38px)"} overflow={"hidden"}>
        {item.entry_notes}
      </Text>
      <Text width={"20%"}>{item.project_tasks.task_types.task_name}</Text>
      {isRunning ? (
        <Timer
          width={"60px"}
          seconds={formatTime(seconds)}
          minutes={formatTime(minutes)}
          hours={formatTime(hours)}
        />
      ) : (
        <Text width={"60px"}>{item.duration}</Text>
      )}
      {dateCheck1 == dateCheck2 && (
        <TimerStartBtn
          width={"38px"}
          startTimer={startTimer}
          stopTimer={stopTimer}
          isRunning={isRunning}
        />
      )}
      <EditTimerModal isOpen={isOpen} onClose={onClose} item={item} />
    </Flex>
  );
};

export default TimerRow;
