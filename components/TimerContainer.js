import { Input, InputGroup, InputRightElement, Flex } from "@chakra-ui/react";
import TimerStartBtn from "./TimerStartBtn";
import Timer from "./Timer";
import TimerSelects from "./TimerSelects";

const TimerContainer = ({
  seconds,
  minutes,
  hours,
  startTimer,
  stopTimer,
  isRunning,
  setClientID,
  setProjectID,
  setTaskTypeID,
  entryNote,
  setEntryNote
}) => {
  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

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
        <InputRightElement right={16} top={3}>
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
