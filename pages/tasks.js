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
import DeleteErrorDialog from "../components/DeleteErrorDialog";

// The Task Types Page
const Tasks = () => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [sortedTaskTypes, setSortedTaskTypes] = useState([]);
  const [sortField, setSortedField] = useState("task_name");
  const [sortOrder, setSortOrder] = useState(true);
  const [editTaskTypeData, setTaskTypeData] = useState({});
  const [deleteTaskTypeId, setDeleteTaskTypeId] = useState();
  const { user } = useAuth();
  const errorMessage = "This Task Type cannot be deleted because it is linked to a Project. Please contact the Time Tracer team for more information.";

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

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

  // Delete task type
  const deleteTaskType = async () => {
    const id = deleteTaskTypeId;
    const { data, error } = await supabaseClient
      .from("task_types")
      .delete()
      .eq("task_type_id", id);

    if (!error) {
      // Refresh the task_type data
      getTaskTypeData().then((results) => {
        setTaskTypes(results);
        setSortedTaskTypes(results);
      });
    }
    setDeleteTaskTypeId(null);

    // Close the Delete Dialog
    onDeleteClose();
  };

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
                  <Th color={"white " + "!important"} textAlign={"center"}>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {taskTypes.map((task, index) => (
                  <TaskTypeItem
                    key={index}
                    {...task}
                    onUpdateOpen={onUpdateOpen}
                    onDeleteOpen={onDeleteOpen}
                    onErrorOpen={onErrorOpen}
                    setTaskTypeData={setTaskTypeData}
                    setDeleteTaskTypeId={setDeleteTaskTypeId}
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
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={"Delete Task Type"}
        type={"Task Type"}
        deleteFunction={deleteTaskType}
      />
      <DeleteErrorDialog
        isOpen={isErrorOpen}
        onClose={onErrorClose}
        title={"Delete Task Type Error"}
        errorMessage={errorMessage}
      />
    </Box>
  );
};

export default Tasks;
