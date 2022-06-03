import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  chakra,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  Flex,
  Alert,
  AlertIcon,
  Text,
  Spacer,
} from "@chakra-ui/react";

// The Edit client modal component
const EditTimerModal = ({
  isOpen,
  onClose,
  item,
  handleRecordDelete,
  setDeleteTaskRecordID,
  getTaskTracking,
}) => {
  // Input States
  const [entryNoteInput, setEntryNoteInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("00");
  const [durationMinutes, setDurationMinutes] = useState("00");
  const [durationHours, setDurationHours] = useState("00");

  // Is loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // // On page load
  useEffect(() => {
    // Store tracking data locally
    setEntryNoteInput(item.entry_notes);
    setDateInput(item.date);
    setDurationSeconds(item.duration.split(":")[2]);
    setDurationMinutes(item.duration.split(":")[1]);
    setDurationHours(item.duration.split(":")[0]);
  }, [item]);

  // Check duration inputs
  const inputVerification = () => {
    let durationHoursVerification = true;
    let durationMinutesVerification = true;
    let durationSecondsVerification = true;

    if (durationHours > 23) {
      durationHoursVerification = false;
    }
    if (durationMinutes > 59) {
      durationMinutesVerification = false;
    }
    if (durationSeconds > 59) {
      durationSecondsVerification = false;
    }

    if (
      durationHoursVerification === false ||
      durationMinutesVerification === false ||
      durationSecondsVerification === false
    ) {
      return false;
    } else {
      return true;
    }
  };

  // Submit the form data
  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Verify duration inputs (one must be given)
      if (inputVerification() == false) {
        setError(
          "Please ensure duration values are valid (the maximum values are - 23h, 59m, and 59s)."
        );
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      // Update data in Supabase
      const { data, error } = await supabaseClient
        .from("task_tracking")
        .update({
          end_time: durationEntry(),
          date: dateInput,
          entry_notes: entryNoteInput,
        })
        .eq("tracking_id", item.tracking_id);
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
          // RESET FORM DATA?
        }, 3000);
      } else {
        // Refresh the task tracking data
        getTaskTracking();
        // Close the modal
        onClose();
      }
      // if statement
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
        // RESET FORM DATA?
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // The delete function to delete a project
  const handleDelete = () => {
    setDeleteTaskRecordID(item.tracking_id);
    handleRecordDelete(item.tracking_id);
  };

  const durationEntry = () => {
    // Build time entry
    const startHours = parseInt(item.start_time.substring(0, 2));
    const startMinutes = parseInt(item.start_time.substring(3, 5));
    const startSeconds = parseInt(item.start_time.substring(6, 8));

    let duration =
      parseInt(durationHours) * 60 * 60 +
      parseInt(durationMinutes) * 60 +
      parseInt(durationSeconds);

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

    return endTime;
  };

  // convert seconds to hours, minutes, and seconds
  const convert = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const secondsLeft = seconds - hours * 3600 - minutes * 60;
    return { hours, minutes, seconds: secondsLeft };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <chakra.form onSubmit={(e) => submitHandler(e)}>
          <ModalHeader>Update Task Timer</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {error && (
              <Alert status="error" mb="6">
                <AlertIcon />
                <Text textAlign="center">{error}</Text>
              </Alert>
            )}
            <FormControl>
              <FormLabel>Task Description</FormLabel>
              <Input
                required
                value={entryNoteInput}
                onChange={(e) => setEntryNoteInput(e.target.value)}
              />
            </FormControl>

            <Flex maxW={550} gap={3}>
              <FormControl mt={4} mr={10}>
                <FormLabel>Date</FormLabel>
                <Input
                  type={"date"}
                  required
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
              </FormControl>
              <FormControl w={170} mt={4}>
                <FormLabel>Hours</FormLabel>
                <Input
                  type="number"
                  required
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                />
              </FormControl>
              <FormControl w={170} mt={4}>
                <FormLabel>Minutes</FormLabel>
                <Input
                  type="number"
                  required
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </FormControl>
              <FormControl w={170} mt={4}>
                <FormLabel>Seconds</FormLabel>
                <Input
                  type="number"
                  required
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={"red"} mr={"auto"} onClick={handleDelete}>
              Delete
            </Button>
            <Button type="submit" colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  );
};

export default EditTimerModal;
