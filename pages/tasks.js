import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";
import { useAuth } from '../context/Auth'
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
import NewTaskTypeModal from "../components/NewTaskTypeModal";
import TaskTypeItem from "../components/TaskTypeItem";
import EditTaskTypeModal from "../components/EditTaskTypeModal";
import DeleteDialog from "../components/DeleteDialog";

// The Task Types Page
const Tasks = () => {
  const [taskTypes, setTaskTypes] = useState([]);
  const [editTaskTypeData, setTaskTypeData] = useState({});
  const { user } = useAuth()

  const getTaskTypeData = async () => {
    let { data: tasks, error } = await supabaseClient
      .from("task_types")
      .select("*");
    return tasks;
  };

  useEffect(() => {
    getTaskTypeData().then((results) => {
      setTaskTypes(results);
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
          <Heading as="h2" size="lg" fontWeight={400}>
            Task Types
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
        {taskTypes.length > 0 && (
          <TableContainer mt={12} bg="white" borderRadius={5} shadow="lg">
            <Table variant="simple">
              <Thead bg="brand.primary">
                <Tr>
                  <Th pr={5} color={"white " + "!important"}>Edit</Th>
                  <Th color={"white " + "!important"}>Task Type</Th>
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
      />
      <EditTaskTypeModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        editTaskTypeData={editTaskTypeData}
        getTaskTypeData={getTaskTypeData}
        setTaskTypes={setTaskTypes}
      />
    </Box>
  );
};

export default Tasks;
