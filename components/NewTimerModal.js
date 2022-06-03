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
  Select,
} from "@chakra-ui/react";
import { getCurrentTime, getCurrentDate } from "../utils/timeAndDataHelpers";

// The New Timer modal component
const NewTimerModal = ({ isOpen, onClose, getTaskTracking }) => {
  // Input States
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [clientID, setClientID] = useState("");
  const [projectID, setProjectID] = useState("");
  const [taskTypeID, setTaskTypeID] = useState("");
  const [entryNoteInput, setEntryNoteInput] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("00");
  const [durationMinutes, setDurationMinutes] = useState("00");
  const [durationHours, setDurationHours] = useState("00");

  // Default date option is current date
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [dateInput, setDateInput] = useState(defaultDate);

  // Is loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClientData().then((results) => {
      setClients(results);
    });
    getProjectData().then((results) => {
      setProjects(results);
    });
    getTaskTypeData().then((results) => {
      setTaskTypes(results);
    });
  }, []);

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
      // Insert new project_task relation
      insertProjectTask().then((result) => {
        // Insert new task tracking record
        insertTaskTracking(result).then(() => {
          // Reset task description and duration values
          setEntryNoteInput("");
          setDurationHours("00");
          setDurationMinutes("00");
          setDurationSeconds("00");
          // Refresh the task tracking data
          getTaskTracking();
          // Close the modal
          onClose();
        });
      });
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
          // RESET FORM DATA?
        }, 3000);
      }
      // if statement
    } catch (error) {
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const durationEntry = () => {
    // Build time entry (start manual entries at "00:00:01")
    const startHours = 0;
    const startMinutes = 0;
    const startSeconds = 1;

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

  const getClientData = async () => {
    let { data: clients, error } = await supabaseClient
      .from("clients")
      .select("*")
      .eq("status", true)
      .order("company", { ascending: true });
    return clients;
  };

  const getProjectData = async () => {
    let { data: projects, error } = await supabaseClient
      .from("projects")
      .select(`*, clients!clients_client_id_fkey (*)`)
      .eq("status", true)
      .order("client_id", { ascending: true });
    return projects;
  };

  const getTaskTypeData = async () => {
    let { data: tasks, error } = await supabaseClient
      .from("task_types")
      .select("*")
      .order("task_name", { ascending: true });
    return tasks;
  };

  // 1. Make a request which generates project_task_id
  const insertProjectTask = async () => {
    const { data, error } = await supabaseClient.from("project_tasks").insert({
      project_id: projectID,
      task_type_id: taskTypeID,
    });

    return data[0].project_task_id;
  };

  const insertTaskTracking = async (projectTaskID) => {
    const { data, error } = await supabaseClient.from("task_tracking").insert({
      start_time: "00:00:01",
      end_time: durationEntry(),
      project_task_id: projectTaskID,
      date: dateInput,
      entry_notes: entryNoteInput,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <chakra.form onSubmit={(e) => submitHandler(e)}>
          <ModalHeader>Create Task Timer</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {error && (
              <Alert status="error" mb="6">
                <AlertIcon />
                <Text textAlign="center">{error}</Text>
              </Alert>
            )}
            <FormControl>
              <FormLabel>Client</FormLabel>
              <Select
                name="client"
                type="client"
                autoComplete="client"
                required
                mb={4}
                value={clientID}
                onChange={(e) => {
                  setClientID(e.target.value);
                }}
              >
                <option key="all" value="">
                  Select a Client
                </option>
                {clients.length > 0 ? (
                  clients.map((client, index) => {
                    return (
                      <option key={index} value={client.client_id}>
                        {client.company}
                      </option>
                    );
                  })
                ) : (
                  <></>
                )}
              </Select>
              <FormLabel>Project</FormLabel>
              <Select
                name="projects"
                type="projects"
                autoComplete="projects"
                required
                mb={4}
                isDisabled={clientID == null || clientID == "" ? true : false}
                value={projectID}
                onChange={(e) => {
                  setProjectID(e.target.value);
                }}
              >
                <option key="all" value="">
                  Select a Project
                </option>
                {projects.length > 0 ? (
                  projects
                    .filter((project) => project.client_id == clientID)
                    .map((project, index) => {
                      return (
                        <option key={index} value={project.project_id}>
                          {project.project_name}
                        </option>
                      );
                    })
                ) : (
                  <></>
                )}
              </Select>
              <FormLabel>Task Type</FormLabel>
              <Select
                name="task_types"
                type="tasdk_types"
                autoComplete="task_types"
                required
                mb={4}
                value={taskTypeID}
                onChange={(e) => setTaskTypeID(e.target.value)}
              >
                <option key="all" value="">
                  Select a Task Type
                </option>
                {taskTypes.length > 0 ? (
                  taskTypes.map((task, index) => {
                    return (
                      <option key={index} value={task.task_type_id}>
                        {task.task_name}
                      </option>
                    );
                  })
                ) : (
                  <></>
                )}
              </Select>
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

export default NewTimerModal;
