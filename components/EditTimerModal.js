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
} from "@chakra-ui/react";

// The Edit client modal component
const EditTimerModal = ({
  isOpen,
  onClose,
  user,
  setClients,
  setSortedClients,
  setSortedField,
  getClientData,
  editClientData,
  item
}) => {
  // Input States
  const [entryNoteInput, setEntryNoteInput] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("00");
  const [durationMinutes, setDurationMinutes] = useState("00");
  const [durationHours, setDurationHours] = useState("00");

  // Is loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // // On page load
  useEffect(() => {
    // Store user profile data locally
    setEntryNoteInput(item.entry_notes);
    setDurationSeconds(item.duration.split(":")[2]);
    setDurationMinutes(item.duration.split(":")[1]);
    setDurationHours(item.duration.split(":")[0]);

    // setEmailInput(editClientData.email);
    // setFirstNameInput(editClientData.first_name);
    // setLastNameInput(editClientData.last_name);
    // setContactNumberInput(editClientData.contact_number);
    // setStatusInput(editClientData.status);
  }, [editClientData]);

  // Return and records with the same value for company name
  const isUnique = async (company) => {
    const { data, error } = await supabaseClient
      .from("clients")
      .select("company")
      .ilike("company", company)
      .not("client_id", "eq", editClientData.client_id)
      .eq("profile_id", user.id);

    return data;
  };

  // Check email and contact number inputs (one must be given)
  const inputVerification = () => {
    if (emailInput == "" && contactNumberInput == "") {
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
      // Verify email/contactNumber inputs (one must be given)
      if (inputVerification() == false) {
        setError("Please enter a value for email or contact number.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      // Get all records with matching company names
      let canCreate = [];
      await isUnique(companyNameInput).then((results) => {
        canCreate = results;
      });
      // Error if company name record already exists
      if (canCreate.length != 0) {
        setError("Company Name must be a unique value.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
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
          setSortedClients(results);
          setSortedField("company");
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
    }
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
              <FormLabel>Task Name</FormLabel>
              <Input
                required
                value={entryNoteInput}
                onChange={(e) => setEntryNoteInput(e.target.value)}
              />
            </FormControl>

            <Flex maxW={64} gap={3}>
              <FormControl mt={4}>
                <FormLabel>Hours</FormLabel>
                <Input
                  type="number"
                  // pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Eg. email@address.com"
                  value={durationHours}
                  onChange={(e) =>  setDurationHours(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Minutes</FormLabel>
                <Input
                  type="number"
                  // pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Eg. email@address.com"
                  value={durationMinutes}
                  onChange={(e) =>  setDurationMinutes(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Seconds</FormLabel>
                <Input
                  type="number"
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Eg. email@address.com"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value)}
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={"red"} mr={'auto'}>Delete</Button>
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
