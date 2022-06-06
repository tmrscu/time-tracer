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
} from "@chakra-ui/react";
import Header from "../components/Header";
import NewInvoiceModal from "../components/NewInvoiceModal";
import { AddIcon } from "@chakra-ui/icons";

const Invoices = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [clientID, setClientID] = useState("");
  const [projectID, setProjectID] = useState("");
  const [invoices, setInvoices] = useState([]);

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

    console.log(invoices);
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
    });
  }, []);

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
        {/* create a table showing invoices */}
        <TableContainer mt={12} bg="white" borderRadius={5} shadow="lg">
          <Table variant="simple">
            <Thead bg="brand.primary">
              <Tr>
                <Th color={"white " + "!important"}>View</Th>
                <Th color={"white " + "!important"}>Client</Th>
                <Th color={"white " + "!important"}>Start Date</Th>
                <Th color={"white " + "!important"}>End Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.map((invoice, index) => (
                <Tr fontSize="sm" key={index}>
                  <Td>
                    <Link href={`/invoice/${invoice.invoice_id}`} target="_blank">
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
      />
    </Box>
  );
};

export default Invoices;
