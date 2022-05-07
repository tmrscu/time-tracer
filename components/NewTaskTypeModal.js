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
  Text
} from "@chakra-ui/react";

const NewTaskType = ({
  isOpen,
  onClose,
  getTaskTypeData,
  user,
  setTaskTypes,
}) => {
  const [taskTypeInput, setTaskTypeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isUnique = async (task_type) => {
    const { data, error } = await supabaseClient
      .from("task_types")
      .select("task_name")
      .ilike("task_name", task_type);

    return data;
  };

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
        getTaskTypeData().then((results) => {
          setTaskTypes(results); // Refresh project data
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
