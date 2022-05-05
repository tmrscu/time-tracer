import { useState, useEffect } from 'react';
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

const UpdateClientModal = ({ isOpen, onClose, updateClient, editClientData}) => {
  const [companyNameInput, setCompanyNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [contactNumberInput, setContactNumberInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  

  const onChangeSwitch = () => {

  }
  // On page load
  useEffect(() => {
    // Store user profile data locally
      setCompanyNameInput(editClientData.company)
      setEmailInput(editClientData.email)
      setFirstNameInput(editClientData.first_name)
      setLastNameInput(editClientData.last_name)
      setContactNumberInput(editClientData.contact_number)
      setStatusInput(editClientData.status)
    }, [editClientData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Client</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Company Name</FormLabel>
            <Input value={companyNameInput} onChange={(e) => setCompanyNameInput(e.value)}/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input value={emailInput} onChange={(e) => setEmailInput(e.value)}/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>First Name</FormLabel>
            <Input value={firstNameInput} onChange={(e) => setFirstNameInput(e.value)}/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Last Name</FormLabel>
            <Input value={lastNameInput} onChange={(e) => setLastNameInput(e.value)}/>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Contact Number</FormLabel>
            <Input value={contactNumberInput} onChange={(e) => setContactNumberInput(e.value)}/>
          </FormControl>

          <FormControl display="flex" alignItems="center" mt={5}>
            <FormLabel htmlFor="email-alerts" mb="0">
              Client Active
            </FormLabel>
            <Switch isChecked={statusInput} onChange={() => setStatusInput(setStatusInput => !setStatusInput)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => updateClient()}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateClientModal;
