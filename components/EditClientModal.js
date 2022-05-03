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

const UpdateClientModal = ({ isOpen, onClose, updateClient}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Client</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Company Name</FormLabel>
            <Input />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>First Name</FormLabel>
            <Input />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email Address</FormLabel>
            <Input />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Last Name</FormLabel>
            <Input />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Contact Number</FormLabel>
            <Input />
          </FormControl>

          {/* <Stack spacing={5} mt={5} direction="row">
            <Checkbox defaultChecked>
            Client Active
            </Checkbox>
          </Stack> */}

          <FormControl display="flex" alignItems="center" mt={5}>
            <FormLabel htmlFor="email-alerts" mb="0">
              Client Active
            </FormLabel>
            <Switch id="email-alerts" />
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
