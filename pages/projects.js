import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";
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
import NewProjectModal from "../components/NewProjectModal";
import ProjectItem from "../components/ProjectItem";
import EditProjectModal from "../components/EditProjectModal";
import DeleteDialog from "../components/DeleteDialog";

// The Projects page
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editProjectData, setEditProjectData] = useState({});
  const [deleteProjectId, setDeleteProjectId] = useState();
  const [clientData, setClientData] = useState([{}]);

  const getProjectData = async () => {
    let { data: projects, error } = await supabaseClient
      .from("projects")
      .select(`*, clients!clients_client_id_fkey (*)`);
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
    });

    getClientData().then((results) => {
      setClientData(results);
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
        {projects.length > 0 && (
          <TableContainer mt={12} bg="white" borderRadius={5} shadow="lg">
            <Table variant="simple">
              <Thead bg="brand.primary">
                <Tr>
                  <Th color={"white " + "!important"}>Edit</Th>
                  <Th color={"white " + "!important"}>Project Name</Th>
                  <Th color={"white " + "!important"}>Hourly Rate</Th>
                  <Th color={"white " + "!important"}>Client / Company</Th>
                  <Th color={"white " + "!important"}>Status</Th>
                  <Th color={"white " + "!important"}>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {projects.map((project, index) => (
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
        )}
      </Container>

      <NewProjectModal
        isOpen={isNewOpen}
        onClose={onNewClose}
        setProjects={setProjects}
        getProjectData={getProjectData}
        clientData={clientData}
      />
      <EditProjectModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        setProjects={setProjects}
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
