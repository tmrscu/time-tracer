import { Td, Tr } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

const ProjectItem = ({
  project_id,
  project_name,
  hourly_rate,
  status,
  client_id,
  clients,
  onUpdateOpen,
  onDeleteOpen,
  setEditProjectData,
  setDeleteProjectId,
}) => {
  const handleEdit = () => {
    setEditProjectData({
      project_id,
      project_name,
      hourly_rate,
      status,
      client_id,
      clients
    });
    onUpdateOpen();
  };

  const handleDelete = () => {
    setDeleteProjectId(project_id);
    onDeleteOpen();
  };

  return (
    <Tr fontSize="sm">
      <Td
        onClick={() => handleEdit()}
        cursor={"pointer"}
        _hover={{ color: "brand.primary" }}
      >
        <EditIcon />
      </Td>
      <Td>{project_name}</Td>
      <Td>${hourly_rate}</Td>
      <Td>
        {clients.company} / {clients.first_name} {clients.last_name}
      </Td>
      <Td
        onClick={handleDelete}
        cursor={"pointer"}
        textAlign={"center"}
        _hover={{ color: "red.500" }}
      >
        <DeleteIcon />{" "}
      </Td>
    </Tr>
  );
};

export default ProjectItem;
