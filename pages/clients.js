import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";
import { useAuth } from "../context/Auth";
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

// The Client Page
const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [editClientData, setEditClientData] = useState({});
  const [deleteClientId, setDeleteClientId] = useState();

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

  const deleteClient = async () => {
    const id = deleteClientId;
    const { data, error } = await supabaseClient
      .from("clients")
      .delete()
      .eq("client_id", id);

    if (!error) {
      // Refresh the task types
      getClientData().then((tasks) => {
        setClients(tasks);
      });
    }
    setDeleteClientId(null);

    // Close the Delete Dialog
    onDeleteClose();
  };

  return (
    <Box bg="#f6f8fc" h="100vh">
      {/* border='1px' borderColor={'black'}  */}
      <Header />
      <Container maxW="6xl" pt={5}>
        <Flex justify={"space-between"}>
          <Heading as="h2" size="lg" fontWeight={700}>
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
        {clients.length > 0 && (
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
                    setDeleteClientId={setDeleteClientId}
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
        user={user}
        setClients={setClients}
        getClientData={getClientData}
      />
      <EditClientModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        setClients={setClients}
        getClientData={getClientData}
        editClientData={editClientData}
      />
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={"Delete Client"}
        type={"Client"}
        deleteFunction={deleteClient}
      />
    </Box>
  );
};

export default Clients;
