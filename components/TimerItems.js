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

const TimerItem = ({ date, duration, items }) => {
  return (
    <Accordion allowMultiple shadow={"lg"} m={6} borderRadius={2}>
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
          <Text>{date}</Text>
          <Flex alignItems={'center'}>
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
        <AccordionPanel pb={4}>
          {items.map((item, index) => {
            return (
              <Flex
                justify={"space-between"}
                key={index}
                py={3}
                borderBottom={"1px"}
                px={4}
                borderColor={"#ccc"}
              >
                <Text>{item.entry_notes}</Text>
                <Text>{item.duration}</Text>
              </Flex>
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

const renderTimerItems = (items) => {
  if (items?.length > 0) {
    // create an array of items grouped by date
    const groupedItems = items.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

    // Map over items, and render a TimerItem for each
    return Object.keys(groupedItems).map((date, index) => {
      const items = groupedItems[date];
      const duration = calcLength(items);
      return <TimerItem date={date} duration={duration} items={items} key={index} />;
    });
  }
};

const TimerItems = ({ date, duration, items }) => {
  return <Box>{renderTimerItems(items)}</Box>;
};

export default TimerItems;

const data = [
  {
    tracking_id: 35,
    start_time: "20:59:37",
    end_time: null,
    duration: null,
    project_task_id: 42,
    date: "2022-05-11",
    entry_notes: "This is my test entry",
    is_invoiced: false,
  },
  {
    tracking_id: 36,
    start_time: "20:18:08",
    end_time: null,
    duration: null,
    project_task_id: 42,
    date: "2022-05-12",
    entry_notes: "This is my test entry",
    is_invoiced: false,
  },
  {
    tracking_id: 37,
    start_time: "20:21:22",
    end_time: null,
    duration: null,
    project_task_id: 42,
    date: "2022-05-12",
    entry_notes: "This is my test entry",
    is_invoiced: false,
  },
  {
    tracking_id: 38,
    start_time: "20:36:39",
    end_time: null,
    duration: null,
    project_task_id: 42,
    date: "2022-05-12",
    entry_notes: "This is my test entry",
    is_invoiced: false,
  },
  {
    tracking_id: 39,
    start_time: "21:06:07",
    end_time: "21:09:06",
    duration: "00:02:59",
    project_task_id: 52,
    date: "2022-05-23",
    entry_notes: "I am working on google alpha",
    is_invoiced: false,
  },
  {
    tracking_id: 40,
    start_time: "21:17:18",
    end_time: null,
    duration: null,
    project_task_id: 53,
    date: "2022-05-23",
    entry_notes: "I am working on a timer test",
    is_invoiced: false,
  },
  {
    tracking_id: 41,
    start_time: "21:18:26",
    end_time: "21:19:47",
    duration: "00:01:21",
    project_task_id: 54,
    date: "2022-05-23",
    entry_notes: "",
    is_invoiced: false,
  },
  {
    tracking_id: 42,
    start_time: "21:23:26",
    end_time: "21:24:26",
    duration: "00:01:00",
    project_task_id: 55,
    date: "2022-05-23",
    entry_notes: "",
    is_invoiced: false,
  },
  {
    tracking_id: 43,
    start_time: "21:27:09",
    end_time: "21:28:09",
    duration: "00:01:00",
    project_task_id: 56,
    date: "2022-05-23",
    entry_notes: "I am working on a test",
    is_invoiced: false,
  },
  {
    tracking_id: 44,
    start_time: "21:29:40",
    end_time: "21:29:55",
    duration: "00:00:15",
    project_task_id: 57,
    date: "2022-05-23",
    entry_notes: "",
    is_invoiced: false,
  },
  {
    tracking_id: 45,
    start_time: "21:30:20",
    end_time: "21:31:27",
    duration: "00:01:07",
    project_task_id: 58,
    date: "2022-05-23",
    entry_notes: "",
    is_invoiced: false,
  },
  {
    tracking_id: 46,
    start_time: "21:33:13",
    end_time: "21:33:18",
    duration: "00:00:05",
    project_task_id: 59,
    date: "2022-05-23",
    entry_notes: "Working on a test",
    is_invoiced: false,
  },
];
