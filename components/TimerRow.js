import { Box, Text, Flex, useDisclosure, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import TimerStartBtn from "./TimerStartBtn";
import Timer from "./Timer";
import { useStopwatch } from "react-timer-hook";
import { supabaseClient } from "../utils/client";
import { formatTime } from "./TimerContainer";
import { getCurrentTime, getCurrentDate } from "../utils/timeAndDataHelpers";
import EditTimerModal from "./EditTimerModal";
import DeleteDialog from "../components/DeleteDialog";
import DeleteErrorDialog from "./DeleteErrorDialog";

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

const TimerRow = ({
  item,
  index,
  getTaskTracking,
  globalIsRunning,
  setGlobalIsRunning,
}) => {
  const [intervalID, setIntervalID] = useState(null);
  const [currentTrackingID, setCurrentTrackingID] = useState(null);
  const [deleteTaskRecordID, setDeleteTaskRecordID] = useState(null);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();
  const errorMessage = "This Task record cannot be deleted because it is linked to an invoice. Please contact the Time Tracer team for more information.";
  const dateCheck1 = new Date(item.date).toLocaleDateString();
  const dateCheck2 = new Date(getCurrentDate()).toLocaleDateString();
  const time = new Date();

  const { start, pause, reset, seconds, minutes, hours, isRunning } =
    useStopwatch({
      autoStart: false,
      precision: "seconds",
    });

  useEffect(() => {
    time.setSeconds(
      time.getSeconds() +
        parseInt(item.duration.substring(0, 2)) * 60 * 60 +
        parseInt(item.duration.substring(3, 5)) * 60 +
        parseInt(item.duration.substring(6, 8))
    );
    // Offset the timer by the item duration
    reset(time);
    // Pause the timer
    pause();
  }, [item]);

  const startTimer = async () => {
    const tempTime = new Date();
    tempTime.setSeconds(
      tempTime.getSeconds() +
        parseInt(hours) * 60 * 60 +
        parseInt(minutes) * 60 +
        parseInt(seconds)
    );

    setCurrentTrackingID(null);
    setCurrentTrackingID(item.tracking_id);

    // Set an interval to update the timer every minute
    const interval = setInterval(() => {
      updateTaskTracking(tracking_id);
    }, 60000);
    setIntervalID(interval);

    // Start the timer
    setGlobalIsRunning(true);
    reset(tempTime);  // Allows us to set the offset dynamically
  };

  // 4. Make insert requests every minute to update the end_time with the current time using the task_tracking.ID from request 3
  const updateTaskTracking = async (tracking_id) => {
    // Build time entry
    const startHours = parseInt(item.start_time.substring(0, 2));
    const startMinutes = parseInt(item.start_time.substring(3, 5));
    const startSeconds = parseInt(item.start_time.substring(6, 8));

    const duration = hours * 60 * 60 + minutes * 60 + seconds;

    const tempEndTime = convert(duration);
    let endHours = startHours + tempEndTime.hours;
    let endMinutes = startMinutes + tempEndTime.minutes;
    let endSeconds = startSeconds + tempEndTime.seconds;

    if (endSeconds > 59) {
      endSeconds = endSeconds - 60;
      endMinutes = endMinutes + 1;
    }
    if (endMinutes > 59) {
      endMinutes = endMinutes - 60;
      endHours = endHours + 1;
    }

    const endTime = `${endHours}:${endMinutes}:${endSeconds}`;

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
    setGlobalIsRunning(false);
    pause(); // Pause timer

    setTimeout(() => {
      getTaskTracking();
    }, 1000);
  };

  // The delete function to handle delete operations
  const handleRecordDelete = (deleteID) => {
    // If the task record is associated to an invoice, user can't delete
    getInvoiceData(deleteID).then((results) => {
      if (results.length > 0) {
        onErrorOpen();
      } else {
        onDeleteOpen();
      }
    });
  };

  // Get Invoice Data Record
  const getInvoiceData = async (deleteID) => {
    const { data, error } = await supabaseClient
      .from("invoice_data")
      .select('*')
      .eq("tracking_id", deleteID);

    return data;
  }

  // Delete Task Record
  const deleteTaskRecord = async () => {
    const id = deleteTaskRecordID;
    const { data, error } = await supabaseClient
      .from("task_tracking")
      .delete()
      .eq("tracking_id", id);

    if (!error) {
      // Refresh the task tracking data
      getTaskTracking();
    }
    setDeleteTaskRecordID(null);

    // Close the Delete Dialog
    onDeleteClose();
    onEditClose();
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
      <EditIcon
        mr={3}
        onClick={onEditOpen}
        cursor={"pointer"}
        pointerEvents={isRunning || globalIsRunning ? "none" : ""}
        opacity={isRunning || globalIsRunning ? 0.3 : 1}
      />
      <Text width={"calc(100% - 30% - 10% - 60px - 38px)"} overflow={"hidden"}>
        {item.entry_notes}
      </Text>
      <Text ml={"5%"} textAlign={"right"} width={"30%"}>
        {item.project_tasks.projects.clients.company} / {item.project_tasks.projects.clients.first_name} {item.project_tasks.projects.clients.last_name}
      </Text>
      <Text ml={"5%"} mr={"5%"} textAlign={"right"} width={"10%"}>
        {item.project_tasks.task_types.task_name}
      </Text>
      <Timer
        width={"60px"}
        seconds={formatTime(seconds)}
        minutes={formatTime(minutes)}
        hours={formatTime(hours)}
      />
      {dateCheck1 == dateCheck2 && (
        <TimerStartBtn
          width={"38px"}
          startTimer={startTimer}
          stopTimer={stopTimer}
          isRunning={isRunning}
          globalIsRunning={globalIsRunning}
        />
      )}
      <EditTimerModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        item={item}
        handleRecordDelete={handleRecordDelete}
        setDeleteTaskRecordID={setDeleteTaskRecordID}
        getTaskTracking={getTaskTracking}
      />
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={"Delete Task Record"}
        type={"Task Record"}
        deleteFunction={deleteTaskRecord}
      />
      <DeleteErrorDialog
        isOpen={isErrorOpen}
        onClose={onErrorClose}
        title={"Delete Task Record Error"}
        errorMessage={errorMessage}
      />
    </Flex>
  );
};

export default TimerRow;
