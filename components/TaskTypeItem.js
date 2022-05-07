import { Td, Tr } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

const TaskTypeItem = ({
  task_type_id,
  task_name,
  onUpdateOpen,
  setTaskTypeData,
}) => {
  const handleEdit = () => {
    setTaskTypeData({
      task_type_id,
      task_name,
    });
    onUpdateOpen();
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
      <Td>{task_name}</Td>
    </Tr>
  );
};

export default TaskTypeItem;
