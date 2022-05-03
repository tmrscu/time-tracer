import { Td, Tr } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import EditClientModal from "./EditClientModal";

const ClientItem = ({
  name,
  email,
  first_name,
  last_name,
  contact_number,
  status,
  onUpdateOpen,
  onDeleteOpen
}) => (
  <Tr fontSize="sm">
    <Td
      onClick={onUpdateOpen}
      cursor={"pointer"}
      _hover={{ color: "brand.primary" }}
    >
      <EditIcon />
    </Td>
    <Td>{name}</Td>
    <Td>{email}</Td>
    <Td>{first_name}</Td>
    <Td>{last_name}</Td>
    <Td>{contact_number}</Td>
    <Td w={2}>{status ? "Active" : "Inactive"} </Td>
    <Td
      onClick={onDeleteOpen}
      cursor={"pointer"}
      textAlign={"center"}
      _hover={{ color: "red.500" }}
    >
      <DeleteIcon />{" "}
    </Td>
  </Tr>
);

export default ClientItem;
