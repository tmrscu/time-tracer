import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";
import {
  Container,
  Flex,
  Button,
  Heading,
  useDisclosure,
  Box,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/react";
import Header from "../components/Header";
import NewInvoiceModal from "../components/NewInvoiceModal";
import { AddIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";

const Invoices = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [clientID, setClientID] = useState("");
  const [projectID, setProjectID] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [sortedInvoices, setSortedInvoices] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [sortField, setSortedField] = useState("");
  const [sortOrder, setSortOrder] = useState(true);

  const getClientData = async () => {
    let { data: clients, error } = await supabaseClient
      .from("clients")
      .select("*")
      .eq("status", true)
      .order("company", { ascending: true });
    return clients;
  };

  const getProjectData = async () => {
    let { data: projects, error } = await supabaseClient
      .from("projects")
      .select(`*, clients!clients_client_id_fkey (*)`)
      .eq("status", true)
      .order("client_id", { ascending: true });
    return projects;
  };

  const getTaskTypeData = async () => {
    let { data: tasks, error } = await supabaseClient
      .from("task_types")
      .select("*")
      .order("task_name", { ascending: true });
    return tasks;
  };

  const getInvoiceData = async () => {
    // Get the invoice data and do a join with clients on client_id
    let { data: invoices, error } = await supabaseClient
      .from("invoices")
      .select("*, clients!client_id_fkey (*))");

    return invoices;
  };

  useEffect(() => {
    getClientData().then((results) => {
      setClients(results);
    });
    getProjectData().then((results) => {
      setProjects(results);
    });
    getTaskTypeData().then((results) => {
      setTaskTypes(results);
    });
    getInvoiceData().then((results) => {
      setInvoices(results);
      setSortedInvoices(sortData(results, "company"));
      setSortedField("company");
    });
  }, []);

  const sortData = (data, sortKey, sortType) => {
    let tempSortOrder = sortOrder; // This fixes the problem with slow state updates
    // Check ascending or descending
    if (sortType === undefined) {
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
    }

    // Sort the data
    const sortedClients = [];
    if (sortKey === "company") {
      sortedClients = data.sort((x, y) => {
        let a = x.clients.company.toUpperCase(),
          b = y.clients.company.toUpperCase();

        if (tempSortOrder == true) {
          return a == b ? 0 : a > b ? 1 : -1;
        } else {
          return a == b ? 0 : a > b ? -1 : 1;
        }
      });
    } else {
      sortedClients = data.sort((x, y) => {
        let a = x[sortKey],
          b = y[sortKey];

        if (tempSortOrder == false) {
          return a == b ? 0 : a > b ? 1 : -1;
        } else {
          return a == b ? 0 : a > b ? -1 : 1;
        }
      });
    }

    return sortedClients;
  };

  const filterByClient = (filteredData, filterCheck) => {
    // Avoid filter for empty string
    if (!filterCheck) {
      return filteredData;
    }

    const filteredInvoices = filteredData.filter(
      (invoice) => invoice.clients.client_id == filterCheck
    );

    console.log(filteredInvoices);

    return filteredInvoices;
  };

  return (
    <Box bg="#f6f8fc" h="100vh">
      <Header />
      <Container maxW="6xl" pt={5}>
        <Flex justify={"space-between"}>
          <Heading as="h2" size="lg" fontWeight={700}>
            Invoices
          </Heading>
          <Button
            bg="brand.primary"
            color="white"
            leftIcon={<AddIcon />}
            onClick={onOpen}
            _hover={{ opacity: 0.8 }}
          >
            New
          </Button>
        </Flex>

        <FormLabel mt={6}>Select a Company / Client to filter by:</FormLabel>
        <Select
          name="client"
          type="client"
          autoComplete="client"
          required
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setSortedInvoices(filterByClient(invoices, e.target.value));
          }}
          mb={6}
        >
          <option key="all" value="">
            All
          </option>
          {clients.length > 0 ? (
            clients.map((clients, index) => {
              return (
                <option key={index} value={clients.client_id}>
                  {clients.company} / {clients.first_name} {clients.last_name}
                </option>
              );
            })
          ) : (
            <></>
          )}
        </Select>

        {/* create a table showing invoices */}
        {sortedInvoices.length > 0 ? (
          <TableContainer mt={12} bg="white" borderRadius={5} shadow="lg">
            <Table variant="simple">
              <Thead bg="brand.primary">
                <Tr>
                  <Th color={"white " + "!important"}>View</Th>
                  <Th
                    color={"white " + "!important"}
                    onClick={() => {
                      setSortedField("company");
                      setSortedInvoices(sortData(sortedInvoices, "company"));
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Client
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
                      setSortedField("start_date");
                      setSortedInvoices(sortData(sortedInvoices, "start_date"));
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Start Date
                    <TriangleUpIcon
                      ml={1}
                      mb={1}
                      style={{
                        display:
                          sortField == "start_date"
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
                          sortField == "start_date"
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
                      setSortedField("end_date");
                      setSortedInvoices(sortData(sortedInvoices, "end_date"));
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    End Date
                    <TriangleUpIcon
                      ml={1}
                      mb={1}
                      style={{
                        display:
                          sortField == "end_date"
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
                          sortField == "end_date"
                            ? sortOrder == true
                              ? "inline-block"
                              : "none"
                            : "none",
                      }}
                    />
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedInvoices.map((invoice, index) => (
                  <Tr fontSize="sm" key={index}>
                    <Td>
                      <Link
                        fontWeight={500}
                        href={`/invoice/invoice?id=${invoice.invoice_id}`}
                        target="_blank"
                      >
                        View Invoice
                      </Link>
                    </Td>
                    <Td>
                      {invoice.clients.company} / {invoice.clients.first_name}{" "}
                      {invoice.clients.last_name}
                    </Td>
                    <Td>{invoice.start_date}</Td>
                    <Td>{invoice.end_date}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Text>There are no invoices for that client.</Text>
        )}
      </Container>
      <NewInvoiceModal
        isOpen={isOpen}
        onClose={onClose}
        clients={clients}
        projects={projects}
        clientID={clientID}
        projectID={projectID}
        setClientID={setClientID}
        setProjectID={setProjectID}
        setInvoices={setInvoices}
        getInvoiceData={getInvoiceData}
        setSortedInvoices={setSortedInvoices}
        sortField={sortField}
        sortData={sortData}
      />
    </Box>
  );
};

export default Invoices;
