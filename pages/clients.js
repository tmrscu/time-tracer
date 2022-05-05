import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";
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
  useDisclosure
} from "@chakra-ui/react";
import Header from "../components/Header";
import { AddIcon } from "@chakra-ui/icons";
import NewClientModal from "../components/NewClientModal";
import ClientItem from "../components/ClientItem";
import EditClientModal from "../components/EditClientModal";
import DeleteDialog from "../components/DeleteDialog";


// The Client Page
const Clients = () => {
  const [clients, setClients] = useState([]);
  const [editClientData, setEditClientData] = useState({});

  const getClientData = async () => {
    let { data: clients, error } = await supabaseClient
      .from("clients")
      .select("*");
    return clients;
  };

  useEffect(() => {
    getClientData().then((results) => {
      setClients(results);
    });
  }, []);

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

  const addClient = () => {
    // Add Client here into supabase

    // Get request and setState of new list of clients

    // Close the add new client modal
    onNewClose();
  };

  const deleteClient = (id) => {
    // Delete Client here
    alert("Woah! Lets delete a client!");
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
        {clients.length > 1 && (
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
                {clients.map((client, index) => (
                  <ClientItem
                    key={index}
                    {...client}
                    onUpdateOpen={onUpdateOpen}
                    onDeleteOpen={onDeleteOpen}
                    setEditClientData={setEditClientData}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
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
        editClientData={editClientData}
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
