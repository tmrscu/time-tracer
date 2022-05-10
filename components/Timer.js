import { Box, Flex } from "@chakra-ui/react";

const Timer = ({ seconds, minutes, hours, days, start, pause }) => {

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  return (
    <Flex pos={'relative'} minWidth={16} alignContent={'center'} h={6}>
      <Box pos={'absolute'} left={0}>
        <span>{formatTime(hours)}</span>:<span>{formatTime(minutes)}</span>:
        <span>{formatTime(seconds)}</span>
      </Box>
    </Flex>
  );
};

export default Timer;
