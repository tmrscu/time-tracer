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
  Alert,
  AlertIcon,
  Text,
  Select,
  Flex,
  Radio,
  RadioGroup,
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
  setInvoices,
  getInvoiceData,
}) => {
  // Input States
  const [invoiceType, setInvoiceType] = useState("All");
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

    return data;
  };

  // Submit the form data
  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Only run if there are existing tasks
      if (taskTracking.length < 1) {
        setError("No tasks found for this invoice.");
        setIsLoading(false);
        return;
      }

      let invoiceData = [];
      // Only filter by date if specifying date range
      if (invoiceType === "Range") {
        invoiceData = taskTracking.filter((task) => {
          if (
            task.date >= startDate &&
            task.date <= endDate &&
            task.project_tasks.projects.client_id === parseInt(clientID)
          ) {
            return task;
          }
        });
      } else {
        invoiceData = taskTracking.filter((task) => {
          if (task.project_tasks.projects.client_id === parseInt(clientID)) {
            return task;
          }
        });
        // Order the data by date
        invoiceData = sortTasks(invoiceData);
        setStartDate(invoiceData[0].date);
        setEndDate(invoiceData[invoiceData.length - 1].date);
      }

      // Validate start date, end date selections
      if (startDate > endDate) {
        setError("End date cannot be before start date.");
        setIsLoading(false);
        return;
      }

      // Check filtered task data
      if (invoiceData.length < 1) {
        setError("No tasks found for this invoice.");
        setIsLoading(false);
        return;
      }

      // Insert new invoice
      insertInvoice()
        .then((result) => {
          // Map over taskTracking and insert into invoice_data where taskTracking

          return invoiceData.map((task) => {
            return {
              tracking_id: task.tracking_id,
              invoice_id: result,
            };
          });
        })
        .then((result) => {
          insertInvoiceData(result).then(() => {
            // Refresh task tracking
            setTaskTracking(getTaskTracking());
            // Refresh invoice data
            getInvoiceData().then((results) => {
              setInvoices(results);
              onClose();
            });
          });
        });
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

  const sortTasks = (data) => {
    const tempSorting = data.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.date) - new Date(b.date);
    });

    return tempSorting;
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

            <FormControl mt={4}>
              <FormLabel>Invoicing Type</FormLabel>
              <RadioGroup
                required
                value={invoiceType}
                onChange={(e) => setInvoiceType(e)}
              >
                <Flex gap={10}>
                  <Radio value={"All"}>All Unbilled Tasks</Radio>
                  <Radio value={"Range"}>Specified Date Range</Radio>
                </Flex>
              </RadioGroup>
            </FormControl>

            {invoiceType === "Range" && (
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
            )}
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
