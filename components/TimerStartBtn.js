import { TriangleDownIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { BsStopFill, BsFillPlayFill } from "react-icons/bs";

const TimerStartBtn = ({ startTimer, stopTimer, isRunning }) => {
  return (
    <Flex
      bg={isRunning ? "red.400" : "brand.primary"}
      borderRadius={"full"}
      p={1}
      justify="center"
      align="center"
      boxSizing="border-box"
      cursor="pointer"
      _hover={{ transform: "scale(1.05)", opacity: "0.8" }}
      transition={"all 0.2s ease"}
      ml={6}
    >
      {isRunning ? (
        <BsStopFill size={30} color="white" onClick={stopTimer} />
      ) : (
        <BsFillPlayFill
          size={30}
          color="white"
          style={{ paddingLeft: "2px" }}
          onClick={startTimer}
        />
      )}
    </Flex>
  );
};

export default TimerStartBtn;
