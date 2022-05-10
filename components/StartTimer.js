import { Input, InputGroup, InputRightElement, Flex } from "@chakra-ui/react";
import TimerStartBtn from "./TimerStartBtn";
import Timer from "./Timer";
import { useStopwatch } from "react-timer-hook";
import TimerSelects from "./TimerSelects";

const StartTimer = () => {
  const { start, pause, reset, seconds, minutes, hours, isRunning } =
    useStopwatch({
      autoStart: false,
      precision: "seconds",
    });

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  const startTime = () => {
    // Send a request to the server to start the timer - get a response back with the task ID
    // Set the ID on the task somewhere so we can pick it up for requests
    // Start a function that will make requests to the server to update duration every 1 minute
    // Start the timer
    start();
  }

  const stopTimer = () => {
    // Send a request to the server to stop the task and update the duration
    // reset the input
    // stop the timer
    // update the state. make a request to get the finished tasks
    reset(0, false);
  }

  return (
    <>
    <InputGroup>
      <Input
        py={8}
        _placeholder={{ color: "gray.600" }}
        placeholder="What are you working on?"
        shadow={"md"}
      />
      <InputRightElement right={16} top={3}>
        <Timer
          seconds={formatTime(seconds)}
          minutes={formatTime(minutes)}
          hours={formatTime(hours)}
        />
        <TimerStartBtn startTimer={startTime} stopTimer={stopTimer} isRunning={isRunning} />
      </InputRightElement>
    </InputGroup>
    <TimerSelects />
    </>
  );
};

export default StartTimer;
