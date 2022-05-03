import {
  Box,
  Heading,
  Container,
  Flex,
  Button,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  useDisclosure,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { AddIcon } from "@chakra-ui/icons";
import NewClientModal from "../components/NewClientModal";
import ClientItem from "../components/ClientItem";
import EditClientModal from "../components/EditClientModal";
import DeleteDialog from "../components/DeleteDialog";

// Create some client data with name, email, first_name, last_name, contact_number, status
// This Data would be set to state, we will use a pattern of updating/deleting clients on Supabase,
// then after that change, we make a get request to get the new list of clients
// then set it to state. Then the clients state get passed down to our various components or even just the client list.
// the client list (where we map over in the Tbody) should automatically update with the new list of clients ... I think
// If not, we just need to put a useEffect in the clientItem and look for a change in the clients state
// 
const clients = [
  {
    name: "Doe Enterprises",
    email: "support@tim-moran.com",
    first_name: "John",
    last_name: "Doe",
    contact_number: "+1 (123) 456-7890",
    status: true,
  },
  {
    name: "Jane Lorem Industries",
    email: "jane.d@gmail.com",
    first_name: "Jane",
    last_name: "Doe",
    contact_number: "+1 (123) 456-7890",
    status: false,
  },
];

// The Client Page
const Clients = () => {
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();

  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const toggleClientStatus = () => {
    // Change Client Status here
  };

  const addClient = () => {
    // Add Client here
    alert('Woah! Lets add a client!');
    // Get request and setState of new list of clients
    // Close the add new client modal
    onNewClose();
  };

  const deleteClient = (id) => {
    // Delete Client here
    alert('Woah! Lets delete a client!');
    // Get request and setState of new list of clients
    // Close the Delete Dialog
    onDeleteClose();
  };

  const updateClient = (id) => {
    // Update Client here
    // Get request and setState of new list of clients
    // Close the Edit Dialog
    alert("Woah! lets update our client");
    onUpdateClose();
  };

  return (
    <Box bg="#f6f8fc" h="100vh">
      {/* border='1px' borderColor={'black'}  */}
      <Header />
      <Container maxW="6xl" pt={5}>
        <Flex justify={"space-between"}>
          <Heading as="h2" size="lg" fontWeight={400}>
            Clients
          </Heading>
          <Button
            bg="brand.primary"
            color="white"
            leftIcon={<AddIcon />}
            onClick={onNewOpen}
          >
            New
          </Button>
        </Flex>
        <TableContainer mt={12} bg="white" borderRadius={5} shadow="lg">
          <Table variant="simple">
            <Thead bg="brand.primary">
              <Tr>
                <Th color={"white " + "!important"}>Edit</Th>
                <Th color={"white " + "!important"}>Company Name</Th>
                <Th color={"white " + "!important"}>Email</Th>
                <Th color={"white " + "!important"}>First Name</Th>
                <Th color={"white " + "!important"}>Last Name</Th>
                <Th color={"white " + "!important"}>Contact Number</Th>
                <Th color={"white " + "!important"}>Status</Th>
                <Th color={"white " + "!important"}>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients.map((client) => (
                <ClientItem
                  key={client.name}
                  {...client}
                  onUpdateOpen={onUpdateOpen}
                  onDeleteOpen={onDeleteOpen}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
      <NewClientModal
        isOpen={isNewOpen}
        onClose={onNewClose}
        addClient={addClient}
      />
      <EditClientModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        updateClient={updateClient}
      />
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={"Delete Client"}
        deleteClient={deleteClient}
      />
    </Box>
  );
};

export default Clients;
