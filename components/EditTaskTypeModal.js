import { useState, useEffect } from "react";
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

// The Edit task type modal component
const EditTaskTypeModal = ({
  isOpen,
  onClose,
  editTaskTypeData,
  getTaskTypeData,
  setTaskTypes,
  setSortedTaskTypes,
  setSortedField,
}) => {
  // Input State
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

  // Update task type
  const updateTaskType = async (event) => {
    event.preventDefault();
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
      // Update data in Supabase
      const { data, error } = await supabaseClient
        .from("task_types")
        .update({
          task_name: taskTypeInput,
        })
        .eq("task_name", editTaskTypeData.task_name);
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        // Get the task types and set state with update data to reflect changes
        getTaskTypeData().then((results) => {
          setTaskTypes(results); // Refresh project data
          setSortedTaskTypes(results);
          setSortedField("task_name");
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

  // On page load
  useEffect(() => {
    // Store user profile data locally
    setTaskTypeInput(editTaskTypeData.task_name);
  }, [editTaskTypeData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <chakra.form onSubmit={(e) => updateTaskType(e)}>
          <ModalHeader>Update Task Type</ModalHeader>
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

export default EditTaskTypeModal;
