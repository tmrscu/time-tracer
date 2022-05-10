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
import { AddIcon, TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import NewProjectModal from "../components/NewProjectModal";
import ProjectItem from "../components/ProjectItem";
import EditProjectModal from "../components/EditProjectModal";
import DeleteDialog from "../components/DeleteDialog";

// The Projects page
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editProjectData, setEditProjectData] = useState({ clients: {} });
  const [deleteProjectId, setDeleteProjectId] = useState();
  const [allClientData, setAllClientData] = useState([]);
  const [activeClientData, setActiveClientData] = useState([{}]);
  const [filterValue, setFilterValue] = useState("");
  const [sortedProjects, setSortedProjects] = useState([]);
  const [sortField, setSortedField] = useState(null);
  const [sortOrder, setSortOrder] = useState(true);

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
    if (sortKey == "company") {
      setSortedProjects(
        sortedProjects.sort((x, y) => {
          let a = x.clients[sortKey].toUpperCase(),
            b = y.clients[sortKey].toUpperCase();

          if (tempSortOrder == true) {
            return a == b ? 0 : a > b ? 1 : -1;
          } else {
            return a == b ? 0 : a > b ? -1 : 1;
          }
        })
      );
    } else if (sortKey != "hourly_rate") {
      setSortedProjects(
        sortedProjects.sort((x, y) => {
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
      setSortedProjects(
        sortedProjects.sort((x, y) => {
          if (tempSortOrder == true) {
            return x[sortKey] - y[sortKey];
          } else {
            return y[sortKey] - x[sortKey];
          }
        })
      );
    }
  };

  useEffect(() => {
    getProjectData().then((results) => {
      setProjects(results);
      setSortedProjects(results);
    });

    getClientData().then((results) => {
      setAllClientData(results);
      setActiveClientData(filterByActiveStatus(results));
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

  const filterByActiveStatus = (filteredData) => {
    const filteredClients = filteredData.filter(
      (client) => client.status == true
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
        setSortedProjects(results);
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
            setSortedProjects(filterByClient(projects, e.target.value));
          }}
          mb={6}
        >
          <option key="all" value="">
            All
          </option>
          {allClientData.length > 0 ? (
            allClientData.map((clients, index) => {
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
        {sortedProjects.filter((sortedProject) => sortedProject.status == true)
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
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("project_name");
                        sortData("project_name");
                      }}
                    >
                      Project Name
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "project_name"
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
                            sortField == "project_name"
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
                        setSortedField("hourly_rate");
                        sortData("hourly_rate");
                      }}
                    >
                      Hourly Rate
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "hourly_rate"
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
                            sortField == "hourly_rate"
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
                        setSortedField("company");
                        sortData("company");
                      }}
                    >
                      Company / Client
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
                    <Th color={"white " + "!important"}>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedProjects
                    .filter((sortedProject) => sortedProject.status == true)
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
        {sortedProjects.filter((sortedProject) => sortedProject.status == false)
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
                    <Th
                      color={"white " + "!important"}
                      onClick={() => {
                        setSortedField("project_name");
                        sortData("project_name");
                      }}
                    >
                      Project Name
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "project_name"
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
                            sortField == "project_name"
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
                        setSortedField("hourly_rate");
                        sortData("hourly_rate");
                      }}
                    >
                      Hourly Rate
                      <TriangleUpIcon
                        ml={1}
                        mb={1}
                        style={{
                          display:
                            sortField == "hourly_rate"
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
                            sortField == "hourly_rate"
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
                        setSortedField("company");
                        sortData("company");
                      }}
                    >
                      Company / Client
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
                    <Th color={"white " + "!important"}>Delete</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sortedProjects
                    .filter((sortedProject) => sortedProject.status == false)
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
        setSortedProjects={setSortedProjects}
        setSortedField={setSortedField}
        filterByClient={filterByClient}
        filterValue={filterValue}
        getProjectData={getProjectData}
        activeClientData={activeClientData}
      />
      <EditProjectModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        setProjects={setProjects}
        setSortedProjects={setSortedProjects}
        setSortedField={setSortedField}
        filterByClient={filterByClient}
        filterValue={filterValue}
        getProjectData={getProjectData}
        editProjectData={editProjectData}
        activeClientData={activeClientData}
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
