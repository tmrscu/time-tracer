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
import { AddIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import NewTaskTypeModal from "../components/NewTaskTypeModal";
import TaskTypeItem from "../components/TaskTypeItem";
import EditTaskTypeModal from "../components/EditTaskTypeModal";
import DeleteDialog from "../components/DeleteDialog";

// The Task Types Page
const Tasks = () => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [sortedTaskTypes, setSortedTaskTypes] = useState([]);
  const [sortField, setSortedField] = useState("task_name");
  const [sortOrder, setSortOrder] = useState(true);
  const [editTaskTypeData, setTaskTypeData] = useState({});
  const { user } = useAuth();

  const getTaskTypeData = async () => {
    let { data: tasks, error } = await supabaseClient
      .from("task_types")
      .select("*")
      .order("task_name", { ascending: true });
    return tasks;
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
    setSortedTaskTypes(
      sortedTaskTypes.sort((x, y) => {
        let a = x[sortKey].toUpperCase(),
          b = y[sortKey].toUpperCase();

        if (tempSortOrder == true) {
          return a == b ? 0 : a > b ? 1 : -1;
        } else {
          return a == b ? 0 : a > b ? -1 : 1;
        }
      })
    );
  };

  useEffect(() => {
    getTaskTypeData().then((results) => {
      setTaskTypes(results);
      setSortedTaskTypes(results);
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

  return (
    <Box bg="#f6f8fc" h="100vh">
      <Header />
      <Container maxW="md" pt={5}>
        <Flex justify={"space-between"}>
          <Heading as="h2" size="lg" fontWeight={700}>
            Task Types
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
        {taskTypes.length > 0 && (
          <TableContainer mt={12} bg="white" borderRadius={5} shadow="lg">
            <Table variant="simple">
              <Thead bg="brand.primary">
                <Tr>
                  <Th pr={5} color={"white " + "!important"}>
                    Edit
                  </Th>
                  <Th
                    color={"white " + "!important"}
                    onClick={() => {
                      setSortedField("task_name");
                      sortData("task_name");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Task Type
                    <TriangleUpIcon
                      ml={1}
                      mb={1}
                      style={{
                        display:
                          sortField == "task_name"
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
                          sortField == "task_name"
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
                {taskTypes.map((task, index) => (
                  <TaskTypeItem
                    key={index}
                    {...task}
                    onUpdateOpen={onUpdateOpen}
                    onDeleteOpen={onDeleteOpen}
                    setTaskTypeData={setTaskTypeData}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <NewTaskTypeModal
        isOpen={isNewOpen}
        onClose={onNewClose}
        getTaskTypeData={getTaskTypeData}
        user={user}
        setTaskTypes={setTaskTypes}
        setSortedTaskTypes={setSortedTaskTypes}
        setSortedField={setSortedField}
      />
      <EditTaskTypeModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        editTaskTypeData={editTaskTypeData}
        getTaskTypeData={getTaskTypeData}
        setTaskTypes={setTaskTypes}
        setSortedTaskTypes={setSortedTaskTypes}
        setSortedField={setSortedField}
      />
    </Box>
  );
};

export default Tasks;
