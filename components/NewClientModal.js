import { useState } from "react";
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
} from "@chakra-ui/react";

const NewClientModal = ({
  isOpen,
  onClose,
  user,
  setClients,
  setSortedClients,
  setSortedField,
  getClientData,
}) => {
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [contactNumberInput, setContactNumberInput] = useState("");
  const [statusInput, setStatusInput] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Return and records with the same value for company name
  const isUnique = async (company) => {
    const { data, error } = await supabaseClient
      .from("clients")
      .select("company")
      .ilike("company", company)
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
      // Insert data into Supabase
      const { data, error } = await supabaseClient.from("clients").insert({
        company: companyNameInput,
        email: emailInput,
        first_name: firstNameInput,
        last_name: lastNameInput,
        contact_number: contactNumberInput,
        status: statusInput,
        profile_id: user.id,
      });
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
          setSortedField(null);
          setCompanyNameInput("");
          setEmailInput("");
          setFirstNameInput("");
          setLastNameInput("");
          setContactNumberInput("");
          setStatusInput(true);
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <chakra.form onSubmit={(e) => submitHandler(e)}>
          <ModalHeader>Add New Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {error && (
              <Alert status="error" mb="6">
                <AlertIcon />
                <Text textAlign="center">{error}</Text>
              </Alert>
            )}
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              <Input
                required
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
                required
                value={firstNameInput}
                onChange={(e) => setFirstNameInput(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                required
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

export default NewClientModal;
