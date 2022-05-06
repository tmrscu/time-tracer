import { Td, Tr } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import EditClientModal from "./EditClientModal";

const ClientItem = ({
  client_id,
  company,
  email,
  first_name,
  last_name,
  contact_number,
  status,
  onUpdateOpen,
  onDeleteOpen,
  setEditClientData,
  setDeleteClientId
}) => {
  const handleEdit = () => {
    setEditClientData({
      client_id,
      company,
      email,
      first_name,
      last_name,
      contact_number,
      status,
    });
    onUpdateOpen();
  };

  const handleDelete = () => {
    setDeleteClientId(client_id);
    onDeleteOpen();
  }

  return (
    <Tr fontSize="sm">
      <Td
        onClick={() => handleEdit()}
        cursor={"pointer"}
        _hover={{ color: "brand.primary" }}
      >
        <EditIcon />
      </Td>
      <Td>{company}</Td>
      <Td>{email}</Td>
      <Td>{first_name}</Td>
      <Td>{last_name}</Td>
      <Td>{contact_number}</Td>
      <Td w={2}>{status ? "Active" : "Inactive"} </Td>
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

export default ClientItem;
