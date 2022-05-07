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
  Switch,
  Alert,
  AlertIcon,
  Text,
  Select,
} from "@chakra-ui/react";

const NewProjectModal = ({
  isOpen,
  onClose,
  setProjects,
  getProjectData,
  clientData,
}) => {
  const [projectNameInput, setProjectNameInput] = useState("");
  const [hourlyRateInput, setHourlyRateInput] = useState("");
  const [clientIdInput, setClientIdInput] = useState("");
  const [statusInput, setStatusInput] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // On page load
  useEffect(() => {
    setClientIdInput(clientData[0].client_id);
  }, [clientData]);

  const isUnique = async (project) => {
    const { data, error } = await supabaseClient
      .from("projects")
      .select("project_name")
      .ilike("project_name", project)
      .eq("client_id", clientIdInput);

    return data;
  };

  // Submit the form data
  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      let canCreate = [];
      // Get all records with matching company names
      await isUnique(projectNameInput).then((results) => {
        canCreate = results;
        console.log(results);
      });
      // Error if project name record already exists
      if (canCreate.length != 0) {
        setError("Project Name must be a unique value.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      // Update data in Supabase
      const { data, error } = await supabaseClient.from("projects").insert({
        project_name: projectNameInput,
        hourly_rate: hourlyRateInput,
        status: statusInput,
        client_id: clientIdInput,
      });
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        getProjectData().then((results) => {
          setProjects(results); // Refresh project data
          setProjectNameInput("");
          setHourlyRateInput("");
          setClientIdInput(clientData[0].client_id);
          setStatusInput(true);
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
        <chakra.form onSubmit={(e) => submitHandler(e)}>
          <ModalHeader>Update Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {error && (
              <Alert status="error" mb="6">
                <AlertIcon />
                <Text textAlign="center">{error}</Text>
              </Alert>
            )}
            <FormControl>
              <FormLabel>Project Name</FormLabel>
              <Input
                required
                value={projectNameInput}
                onChange={(e) => setProjectNameInput(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Hourly Rate</FormLabel>
              <Input
                required
                value={hourlyRateInput}
                onChange={(e) => setHourlyRateInput(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Client / Company</FormLabel>
              <Select
                name="client"
                type="client"
                autoComplete="client"
                required
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                mb={6}
              >
                {clientData.map((clients, index) => {
                  return (
                    <option key={index} value={clients.client_id}>
                      {clients.first_name} {clients.last_name} /{" "}
                      {clients.company}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl display="flex" alignItems="center" mt={5}>
              <FormLabel htmlFor="email-alerts" mb="0">
                Project Active
              </FormLabel>
              <Switch
                isChecked={statusInput}
                onChange={() =>
                  setStatusInput((setStatusInput) => !setStatusInput)
                }
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

export default NewProjectModal;
