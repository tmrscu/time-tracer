import { useState } from "react";
import { supabaseClient } from "../utils/client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  chakra,
  Alert,
  AlertIcon,
  Text,
} from "@chakra-ui/react";

// The new task type modal component
const NewTaskType = ({
  isOpen,
  onClose,
  getTaskTypeData,
  user,
  setTaskTypes,
  setSortedTaskTypes,
  setSortedField,
}) => {
  // Input States
  const [taskTypeInput, setTaskTypeInput] = useState("");

  // Is loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check the task type name is unique
  const isUnique = async (task_type) => {
    const { data, error } = await supabaseClient
      .from("task_types")
      .select("task_name")
      .ilike("task_name", task_type);
    return data;
  };

  // Create a new task type
  const addNewTaskType = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let canCreate = [];
      // Get all records with matching company names
      await isUnique(taskTypeInput).then((results) => {
        canCreate = results;
      });
      if (canCreate.length != 0) {
        setError("Task Type name must be a unique value.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      // Insert the new task type into the database
      const { data, error } = await supabaseClient
        .from("task_types")
        .insert({ task_name: taskTypeInput, profile_id: user.id });
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        // Get the new task type data to reflect changes
        getTaskTypeData().then((results) => {
          setTaskTypes(results); // Refresh project data
          setSortedTaskTypes(results);
          setSortedField("task_name");
          setTaskTypeInput("");
          onClose(); // Closes Modal
        });
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <chakra.form onSubmit={(e) => addNewTaskType(e)}>
          <ModalHeader>Add New Task Type</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {error && (
              <Alert status="error" mb="6">
                <AlertIcon />
                <Text textAlign="center">{error}</Text>
              </Alert>
            )}
            <FormControl>
              <FormLabel>Task Type</FormLabel>
              <Input
                required
                value={taskTypeInput}
                onChange={(e) => setTaskTypeInput(e.target.value)}
              />
            </FormControl>
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

export default NewTaskType;
