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
  Checkbox,
  Stack,
  Switch,
} from "@chakra-ui/react";

const UpdateClientModal = ({
  isOpen,
  onClose,
  setClients,
  getClientData,
  editClientData,
}) => {
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [contactNumberInput, setContactNumberInput] = useState("");
  const [statusInput, setStatusInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // On page load
  useEffect(() => {
    // Store user profile data locally
    setCompanyNameInput(editClientData.company);
    setEmailInput(editClientData.email);
    setFirstNameInput(editClientData.first_name);
    setLastNameInput(editClientData.last_name);
    setContactNumberInput(editClientData.contact_number);
    setStatusInput(editClientData.status);
  }, [editClientData]);

  // Submit the form data
  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Update data in Supabase
      const { data, error } = await supabaseClient
        .from("clients")
        .update({
          company: companyNameInput,
          email: emailInput,
          first_name: firstNameInput,
          last_name: lastNameInput,
          contact_number: contactNumberInput,
          status: statusInput,
        })
        .eq("client_id", editClientData.client_id);
      if (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
          // RESET FORM DATA?
        }, 3000);
      } else {
        getClientData().then((results) => {
          setClients(results); // Refresh client data
          onClose(); // Closes Modal
        });
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
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Client</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Company Name</FormLabel>
            <Input
              value={companyNameInput}
              onChange={(e) => setCompanyNameInput(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>First Name</FormLabel>
            <Input
              value={firstNameInput}
              onChange={(e) => setFirstNameInput(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Last Name</FormLabel>
            <Input
              value={lastNameInput}
              onChange={(e) => setLastNameInput(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Contact Number</FormLabel>
            <Input
              value={contactNumberInput}
              onChange={(e) => setContactNumberInput(e.target.value)}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" mt={5}>
            <FormLabel htmlFor="email-alerts" mb="0">
              Client Active
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
          <Button colorScheme="blue" mr={3} onClick={(e) => submitHandler(e)}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateClientModal;
