import { Input, InputGroup, InputRightElement, Flex } from "@chakra-ui/react";
import TimerStartBtn from "./TimerStartBtn";
import Timer from "./Timer";
import TimerSelects from "./TimerSelects";

export const formatTime = (time) => {
  return String(time).padStart(2, "0");
};

const TimerContainer = ({
  seconds,
  minutes,
  hours,
  startTimer,
  stopTimer,
  isRunning,
  clientID,
  projectID,
  taskTypeID,
  setClientID,
  setProjectID,
  setTaskTypeID,
  entryNote,
  setEntryNote,
  getTaskTracking,
}) => {
  return (
    <>
      <InputGroup>
        <Input
          py={8}
          _placeholder={{ color: "gray.600" }}
          placeholder="What are you working on?"
          shadow={"md"}
          value={entryNote}
          onChange={(e) => setEntryNote(e.target.value)}
        />
        <InputRightElement
          right={16}
          top={3}
          pointerEvents={
            clientID == null ||
            projectID == null ||
            taskTypeID == null ||
            clientID == "" ||
            projectID == "" ||
            taskTypeID == ""
              ? "none"
              : ""
          }
          opacity={
            clientID == null ||
            projectID == null ||
            taskTypeID == null ||
            clientID == "" ||
            projectID == "" ||
            taskTypeID == ""
              ? 0.3
              : 1
          }
        >
          <Timer
            seconds={formatTime(seconds)}
            minutes={formatTime(minutes)}
            hours={formatTime(hours)}
          />
          <TimerStartBtn
            startTimer={startTimer}
            stopTimer={stopTimer}
            isRunning={isRunning}
          />
        </InputRightElement>
      </InputGroup>
      <TimerSelects
        setClientID={setClientID}
        setProjectID={setProjectID}
        setTaskTypeID={setTaskTypeID}
      />
    </>
  );
};

export default TimerContainer;
