import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";
import {
  Box,
  Heading,
  Container,
  Flex,
  Button,
  FormLabel,
  Select,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import Header from "../components/Header";
import { AddIcon } from "@chakra-ui/icons";
import NewProjectModal from "../components/NewProjectModal";
import ProjectItem from "../components/ProjectItem";
import EditProjectModal from "../components/EditProjectModal";
import DeleteDialog from "../components/DeleteDialog";

// The Projects page
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editProjectData, setEditProjectData] = useState({clients: {}});
  const [deleteProjectId, setDeleteProjectId] = useState();
  const [clientData, setClientData] = useState([{}]);
  const [filterValue, setFilterValue] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const getProjectData = async () => {
    let { data: projects, error } = await supabaseClient
      .from("projects")
      .select(`*, clients!clients_client_id_fkey (*)`)
      .order("client_id", { ascending: true });
    return projects;
  };

  const getClientData = async (id) => {
    let { data: clients, error } = await supabaseClient
      .from("clients")
      .select("*");
    return clients;
  };

  useEffect(() => {
    getProjectData().then((results) => {
      setProjects(results);
      setFilteredList(filterByClient(results, ""));
    });

    getClientData().then((results) => {
      setClientData(results);
    });
  }, []);

  const filterByClient = (filteredData, filterCheck) => {
    // Avoid filter for empty string
    if (!filterCheck) {
      return filteredData;
    }

    const filteredClients = filteredData.filter(
      (project) => project.client_id == filterCheck
    );

    return filteredClients;
  };

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

  const deleteProject = async () => {
    const id = deleteProjectId;
    const { data, error } = await supabaseClient
      .from("projects")
      .delete()
      .eq("project_id", id);

    if (!error) {
      // Refresh the project data
      getProjectData().then((results) => {
        setProjects(results);
        setFilteredList(results);
      });
    }
    setDeleteProjectId(null);

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
            Projects
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
        <FormLabel mt={6}>Select a Company / Client to filter by:</FormLabel>
        <Select
          name="client"
          type="client"
          autoComplete="client"
          required
          value={filterValue}
          onChange={(e) => {
            setFilterValue(e.target.value);
            setFilteredList(filterByClient(projects, e.target.value));
          }}
          mb={6}
        >
          <option key="all" value="">
            All
          </option>
          {clientData.map((clients, index) => {
            return (
              <option key={index} value={clients.client_id}>
                {clients.company} / {clients.first_name} {clients.last_name}
              </option>
            );
          })}
        </Select>
        {filteredList.filter((filteredList) => filteredList.status == true)
          .length > 0 ? (
          <>
            <Heading as="h4" size="md" mt={10} mb={4}>
              Active Projects
            </Heading>
            <TableContainer bg="white" borderRadius={5} shadow="lg">
              <Table variant="simple">
                <Thead bg="brand.primary">
                  <Tr>
                    <Th color={"white " + "!important"}>Edit</Th>
                    <Th color={"white " + "!important"}>Project Name</Th>
                    <Th color={"white " + "!important"}>Hourly Rate</Th>
                    <Th color={"white " + "!important"}>Company / Client</Th>
                    <Th color={"white " + "!important"}>Status</Th>
                    <Th color={"white " + "!important"}>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredList
                    .filter((filteredList) => filteredList.status == true)
                    .map((project, index) => (
                      <ProjectItem
                        key={index}
                        {...project}
                        onUpdateOpen={onUpdateOpen}
                        onDeleteOpen={onDeleteOpen}
                        setEditProjectData={setEditProjectData}
                        setDeleteProjectId={setDeleteProjectId}
                      />
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            <Heading as="h4" size="md" mt={10} mb={4}>
              Active Projects
            </Heading>
            <Text>There are no active projects.</Text>
          </>
        )}
        {filteredList.filter((filteredList) => filteredList.status == false)
          .length > 0 ? (
          <>
            <Heading as="h4" size="md" mt={10} mb={4}>
              Inactive Projects
            </Heading>
            <TableContainer bg="white" borderRadius={5} shadow="lg">
              <Table variant="simple">
                <Thead bg="brand.primary">
                  <Tr>
                    <Th color={"white " + "!important"}>Edit</Th>
                    <Th color={"white " + "!important"}>Project Name</Th>
                    <Th color={"white " + "!important"}>Hourly Rate</Th>
                    <Th color={"white " + "!important"}>Company / Client</Th>
                    <Th color={"white " + "!important"}>Status</Th>
                    <Th color={"white " + "!important"}>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredList
                    .filter((filteredList) => filteredList.status == false)
                    .map((project, index) => (
                      <ProjectItem
                        key={index}
                        {...project}
                        onUpdateOpen={onUpdateOpen}
                        onDeleteOpen={onDeleteOpen}
                        setEditProjectData={setEditProjectData}
                        setDeleteProjectId={setDeleteProjectId}
                      />
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <>
            <Heading as="h4" size="md" mt={10} mb={4}>
              Active Projects
            </Heading>
            <Text>There are no inactive projects.</Text>
          </>
        )}
      </Container>

      <NewProjectModal
        isOpen={isNewOpen}
        onClose={onNewClose}
        setProjects={setProjects}
        setFilteredList={setFilteredList}
        filterByClient={filterByClient}
        filterValue={filterValue}
        getProjectData={getProjectData}
        clientData={clientData}
      />
      <EditProjectModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        setProjects={setProjects}
        setFilteredList={setFilteredList}
        filterByClient={filterByClient}
        filterValue={filterValue}
        getProjectData={getProjectData}
        editProjectData={editProjectData}
        clientData={clientData}
      />
      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={"Delete Project"}
        type={"Project"}
        deleteFunction={deleteProject}
      />
    </Box>
  );
};

export default Projects;
