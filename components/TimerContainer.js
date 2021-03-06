import { Input, InputGroup, InputRightElement, Flex } from "@chakra-ui/react";
import TimerStartBtn from "./TimerStartBtn";
import Timer from "./Timer";
import TimerSelects from "./TimerSelects";
import { BsPlus } from "react-icons/bs";

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
  globalIsRunning,
  onNewOpen,
}) => {
  return (
    <>
      <InputGroup>
        <Flex
          bg={"brand.primary"}
          borderRadius={"full"}
          p={1}
          height={"40px"}
          justify="center"
          align="center"
          boxSizing="border-box"
          cursor="pointer"
          _hover={{ transform: "scale(1.05)", opacity: "0.8" }}
          transition={"all 0.2s ease"}
          mt={13}
          mr={3}
          pointerEvents={globalIsRunning ? "none" : ""}
          opacity={globalIsRunning ? 0.3 : 1}
        >
          <BsPlus size={30} color="white" onClick={onNewOpen} />
        </Flex>
        <Input
          py={8}
          _placeholder={{ color: "gray.600" }}
          placeholder="What are you working on?"
          shadow={"md"}
          value={entryNote}
          onChange={(e) => setEntryNote(e.target.value)}
          disabled={isRunning ? true : false}
          pr={"160px"}
        />
        <InputRightElement
          right={16}
          top={3}
          pointerEvents={
            (globalIsRunning == true && isRunning == false) ||
            entryNote == null ||
            clientID == null ||
            projectID == null ||
            taskTypeID == null ||
            entryNote == "" ||
            clientID == "" ||
            projectID == "" ||
            taskTypeID == ""
              ? "none"
              : ""
          }
          opacity={
            (globalIsRunning == true && isRunning == false) ||
            entryNote == null ||
            clientID == null ||
            projectID == null ||
            taskTypeID == null ||
            entryNote == "" ||
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
        clientID={clientID}
        projectID={projectID}
        taskTypeID={taskTypeID}
        setClientID={setClientID}
        setProjectID={setProjectID}
        setTaskTypeID={setTaskTypeID}
        isRunning={isRunning}
      />
    </>
  );
};

export default TimerContainer;
