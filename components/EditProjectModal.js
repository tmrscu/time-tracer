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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalFooter,
  Button,
  Switch,
  Alert,
  AlertIcon,
  Text,
  Select,
} from "@chakra-ui/react";

// Edit Project Modal component
const EditProjectModal = ({
  isOpen,
  onClose,
  setProjects,
  setSortedProjects,
  setSortedField,
  setSortOrder,
  filterByClient,
  filterValue,
  getProjectData,
  editProjectData,
  activeClientData,
}) => {
  // Input State
  const [projectNameInput, setProjectNameInput] = useState("");
  const [hourlyRateInput, setHourlyRateInput] = useState(0.0);
  const [clientIdInput, setClientIdInput] = useState("");
  const [statusInput, setStatusInput] = useState(true);

  // Is loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // On page load
  useEffect(() => {
    // Store project data locally
    setProjectNameInput(editProjectData.project_name);
    setHourlyRateInput(editProjectData.hourly_rate);
    setClientIdInput(editProjectData.client_id);
    setStatusInput(editProjectData.status);
  }, [editProjectData]);

  // Check the client id is unique
  const isUnique = async (project) => {
    const { data, error } = await supabaseClient
      .from("projects")
      .select("project_name")
      .ilike("project_name", project)
      .not("project_id", "eq", editProjectData.project_id)
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
      const { data, error } = await supabaseClient
        .from("projects")
        .update({
          project_name: projectNameInput,
          hourly_rate: hourlyRateInput,
          status: statusInput,
          client_id: clientIdInput,
        })
        .eq("project_id", editProjectData.project_id);
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        getProjectData().then((results) => {
          setProjects(results); // Refresh project data
          setSortedProjects(filterByClient(results, filterValue)); // Refresh sorted list
          setSortedField("company");
          setSortOrder(true);
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
            {editProjectData.clients.status ? (
              <></>
            ) : (
              <Text mb={6} color={"red"}>
                Projects associated to an inactive client cannot have their
                company/client or status updated.
              </Text>
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
              <NumberInput
                required
                onChange={(valueString) => setHourlyRateInput(valueString)}
                value={hourlyRateInput}
                step={0.01}
                min={0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Company / Client</FormLabel>
              <Select
                name="client"
                type="client"
                autoComplete="client"
                required
                isDisabled={editProjectData.clients.status ? false : true}
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                mb={6}
              >
                {editProjectData.clients.status ? (
                  activeClientData.map((clients, index) => {
                    return (
                      <option key={index} value={clients.client_id}>
                        {clients.company} / {clients.first_name}{" "}
                        {clients.last_name}
                      </option>
                    );
                  })
                ) : (
                  <option>
                    {editProjectData.clients.company} /{" "}
                    {editProjectData.clients.first_name}{" "}
                    {editProjectData.clients.last_name}
                  </option>
                )}
              </Select>
            </FormControl>

            <FormControl display="flex" alignItems="center" mt={5}>
              <FormLabel htmlFor="email-alerts" mb="0">
                Project Active
              </FormLabel>
              <Switch
                isChecked={statusInput}
                isDisabled={editProjectData.clients.status ? false : true}
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

export default EditProjectModal;
