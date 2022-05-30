import {
  Box,
  Text,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Tag,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import TimerRow from "./TimerRow";
import { formatTime } from "./TimerContainer";
import { convertDateString } from "../utils/timeAndDataHelpers";

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

  return (
    formatTime(sumTime.hours) +
    ":" +
    formatTime(sumTime.minutes) +
    ":" +
    formatTime(sumTime.seconds)
  );
};

const TimerItem = ({
  date,
  items,
  setTaskTracking,
  getTaskTracking,
}) => {
  return (
    <Accordion
      allowMultiple
      defaultIndex={[0]}
      shadow={"lg"}
      my={6}
      borderRadius={2}
    >
      <AccordionItem>
        <AccordionButton
          display={"flex"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          p={3}
          borderTopRadius={4}
          fontWeight={700}
          bg={"brand.primary"}
          color="white"
          _hover={{ opacity: 0.85 }}
        >
          <Text>{convertDateString(date)}</Text>
          <Flex alignItems={"center"}>
            <Text>{calcLength(items)}</Text>
            <Box
              color={"white"}
              w={7}
              borderRadius={"500px"}
              border={"1px"}
              ml={6}
            >
              {items.length}
            </Box>
          </Flex>
          {/* Map over the items and render them */}
        </AccordionButton>
        <AccordionPanel px={3} py={0}>
          {items.map((item, index) => {
            return (
              <TimerRow
                item={item}
                index={index}
                key={index}
                setTaskTracking={setTaskTracking}
                getTaskTracking={getTaskTracking}
              />
            );
          })}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const TimerContainer = ({ date }) => {
  return <Box>{JSON.stringify(date)}</Box>;
};

const renderTimerItems = (props) => {
  if (props.items?.length > 0) {
    // create an array of items grouped by date
    const groupedItems = props.items.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    // Sort the array with most recent date at the top
    props.items.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });

    // Map over items, and render a TimerItem for each
    return Object.keys(groupedItems).map((date, index) => {
      const items = groupedItems[date];
      return (
        <TimerItem
          date={date}
          items={items}
          key={index}
          setTaskTracking={props.setTaskTracking}
          getTaskTracking={props.getTaskTracking}
        />
      );
    });
  }
};

const TimerItems = (props) => {
  return <Box>{renderTimerItems(props)}</Box>;
};

export default TimerItems;
