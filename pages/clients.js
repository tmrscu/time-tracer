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
  Text,
  Checkbox,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { AddIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import NewClientModal from "../components/NewClientModal";
import ClientItem from "../components/ClientItem";
import EditClientModal from "../components/EditClientModal";
import DeleteDialog from "../components/DeleteDialog";

// The Client Page
const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [sortedClients, setSortedClients] = useState([]);
  const [sortField, setSortedField] = useState("company");
  const [sortOrder, setSortOrder] = useState(true);
  const [editClientData, setEditClientData] = useState({});
  const [deleteClientId, setDeleteClientId] = useState();
  const [showActiveClients, setShowActiveClients] = useState(true);
  const [showInactiveClients, setShowInactiveClients] = useState(false);

  // Get the clients data
  const getClientData = async () => {
    let { data: clients, error } = await supabaseClient
      .from("clients")
      .select("*")
      .order("company", { ascending: true });
    return clients;
  };

  const sortData = (sortKey) => {
    // NOTE = on edit or new, the table defaults to no sorting

    let tempSortOrder; // This fixes the problem with slow state updates
    // Check ascending or descending
    if (sortKey === sortField) {
      if (sortOrder === false) {
        setSortOrder(true);
        tempSortOrder = true;
      } else {
        setSortOrder(false);
        tempSortOrder = false;
      }
    } else {
      setSortOrder(true);
      tempSortOrder = true;
    }

    // Sort the data
    if (sortKey != "contact_number") {
      setSortedClients(
        sortedClients.sort((x, y) => {
          let a = x[sortKey].toUpperCase(),
            b = y[sortKey].toUpperCase();

          if (tempSortOrder == true) {
            return a == b ? 0 : a > b ? 1 : -1;
          } else {
            return a == b ? 0 : a > b ? -1 : 1;
          }
        })
      );
    } else {
      setSortedClients(
        sortedClients.sort((x, y) => {
          if (tempSortOrder == true) {
            return x[sortKey] - y[sortKey];
          } else {
            return y[sortKey] - x[sortKey];
          }
        })
      );
    }
  };

  // On page load, get the clients data and sort
  useEffect(() => {
    getClientData().then((results) => {
      setClients(results);
      setSortedClients(results);
    });
  }, []);

  // Modal operations
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


  // Delete client function
  const deleteClient = async () => {
    const id = deleteClientId;
    const { data, error } = await supabaseClient
      .from("clients")
      .delete()
      .eq("client_id", id);

    if (!error) {
      // Refresh the clients
      getClientData().then((clients) => {
        setClients(clients);
        setSortedClients(clients);
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
            _hover={{ opacity: 0.8 }}
          >
            New
          </Button>
        </Flex>

        <Heading as="h4" size="sm" mt={10} mb={4}>
          Filter Client List
        </Heading>
        <Checkbox
          isChecked={showActiveClients}
          mr={5}
          onChange={(e) => setShowActiveClients(e.target.checked)}
        >
          Active Clients
        </Checkbox>
        <Checkbox
          isChecked={showInactiveClients}
          onChange={(e) => setShowInactiveClients(e.target.checked)}
        >
          Inactive Clients
        </Checkbox>

        {sortedClients.filter((client) => client.status == true).length > 0 &&
        showActiveClients ? (
          <>
            <Heading as="h4" size="md" mt={10} mb={4}>
              Active Clients
            </Heading>
            <TableContainer bg="white" borderRadius={5} shadow="lg">
              <Table variant="simple">
                <Thead bg="brand.primary">
                  <Tr>
                    <Th color={"white " + "!important"}>Edit</Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("company");
                        sortData("company");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Company Name
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "company"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "company"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("email");
                        sortData("email");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Email
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "email"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "email"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("first_name");
                        sortData("first_name");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      First Name
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "first_name"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "first_name"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("last_name");
                        sortData("last_name");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Last Name
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "last_name"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "last_name"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("contact_number");
                        sortData("contact_number");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Contact Number
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "contact_number"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "contact_number"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th color={"white " + "!important"} textAlign={"center"}>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {clients
                    .filter((client) => client.status == true)
                    .map((client, index) => (
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
          </>
        ) : showActiveClients ? (
          <>
            <Heading as="h4" size="md" mt={10} mb={4}>
              Active Clients
            </Heading>
            <Text>There are no active clients.</Text>
          </>
        ) : (
          <></>
        )}
        {sortedClients.filter((client) => client.status == false).length > 0 &&
        showInactiveClients ? (
          <>
            <Heading as="h4" size="md" mt={10} mb={4}>
              Inactive Clients
            </Heading>
            <TableContainer bg="white" borderRadius={5} shadow="lg">
              <Table variant="simple">
                <Thead bg="brand.primary">
                  <Tr>
                    <Th color={"white " + "!important"}>Edit</Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("company");
                        sortData("company");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Company Name
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "company"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "company"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("email");
                        sortData("email");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Email
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "email"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "email"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("first_name");
                        sortData("first_name");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      First Name
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "first_name"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "first_name"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("last_name");
                        sortData("last_name");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Last Name
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "last_name"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "last_name"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("contact_number");
                        sortData("contact_number");
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Contact Number
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "contact_number"
                              ? sortOrder == false
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                      <TriangleDownIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "contact_number"
                              ? sortOrder == true
                                ? "inline-block"
                                : "none"
                              : "none",
                        }}
                      />
                    </Th>
                    <Th color={"white " + "!important"} textAlign={"center"}>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {clients
                    .filter((client) => client.status == false)
                    .map((client, index) => (
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
          </>
        ) : showInactiveClients ? (
          <>
            <Heading as="h4" size="md" mt={10} mb={4}>
              Inactive Clients
            </Heading>
            <Text>There are no inactive clients.</Text>
          </>
        ) : (
          <></>
        )}
      </Container>

      <NewClientModal
        isOpen={isNewOpen}
        onClose={onNewClose}
        user={user}
        setClients={setClients}
        setSortedClients={setSortedClients}
        setSortedField={setSortedField}
        getClientData={getClientData}
      />
      <EditClientModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        user={user}
        setClients={setClients}
        setSortedClients={setSortedClients}
        setSortedField={setSortedField}
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
