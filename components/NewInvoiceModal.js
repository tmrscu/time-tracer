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
  Switch,
  Alert,
  AlertIcon,
  Text,
  Select,
  Flex,
} from "@chakra-ui/react";

// The new client modal component
const NewInvoiceModal = ({
  isOpen,
  onClose,
  user,
  clients,
  projects,
  clientID,
  projectID,
  setClientID,
  setProjectID,
}) => {
  // Input States
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [contactNumberInput, setContactNumberInput] = useState("");
  const [statusInput, setStatusInput] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Is loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskTracking, setTaskTracking] = useState([]);

  // get all the task_tracking
  const getTaskTracking = async () => {
    let { data: taskTracking, error } = await supabaseClient
      .from("task_tracking")
      .select("*, project_tasks(*, projects!projects_project_id_fkey(*))")
      .eq("is_invoiced", false);
    return taskTracking;
  };

  useEffect(() => {
    getTaskTracking().then((results) => {
      setTaskTracking(results);
    });
  }, []);

  const insertInvoice = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabaseClient.from("invoices").insert({
      client_id: clientID,
      start_date: startDate,
      end_date: endDate,
    });
    return data[0].invoice_id;
  };

  const insertInvoiceData = async (invoiceData) => {
    const { data, error } = await supabaseClient
    .from("invoice_data")
    .insert(invoiceData);

    console.log('Inserting data')
  }

  // Submit the form data
  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const invoiceData = taskTracking.filter((task) => {
        if (
          task.date >= startDate &&
          task.date <= endDate &&
          task.project_tasks.projects.client_id === parseInt(clientID)
        ) {
          return task;
        }
      });

      console.log(invoiceData);
      if (invoiceData.length < 1) {
        setError("No tasks found for this invoice");
        setIsLoading(false);
        return;
      }

      // Insert new invoice
      insertInvoice().then((result) => {
        // Map over taskTracking and insert into invoice_data where taskTracking

        return invoiceData.map((task) => {
          return {
            tracking_id: task.tracking_id,
            invoice_id: result,
          };
        });
      }).then((result) => {
        insertInvoiceData(result);
      })
      setTaskTracking(getTaskTracking())
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
          <ModalHeader>Create New Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {error && (
              <Alert status="error" mb="6">
                <AlertIcon />
                <Text textAlign="center">{error}</Text>
              </Alert>
            )}
            <Select
              name="client"
              type="client"
              autoComplete="client"
              required
              mb={6}
              value={clientID}
              onChange={(e) => {
                setClientID(e.target.value);
              }}
            >
              <option key="all" value="">
                Select a Client
              </option>
              {clients.length > 0 ? (
                clients.map((client, index) => {
                  return (
                    <option key={index} value={client.client_id}>
                      {client.company}
                    </option>
                  );
                })
              ) : (
                <></>
              )}
            </Select>

            <Flex gap={12}>
              <FormControl mt={4}>
                <FormLabel>Start Date</FormLabel>
                <Input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>End Date</FormLabel>
                <Input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" colorScheme="blue" mr={3}>
              Save Invoice
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </chakra.form>
      </ModalContent>
    </Modal>
  );
};

export default NewInvoiceModal;
