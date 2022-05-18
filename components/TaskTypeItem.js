import { Td, Tr } from "@chakra-ui/react";
import { supabaseClient } from "../utils/client";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

// The task item component
const TaskTypeItem = ({
  task_type_id,
  task_name,
  onUpdateOpen,
  onDeleteOpen,
  onErrorOpen,
  setTaskTypeData,
  setDeleteTaskTypeId,
}) => {
  // Get project_tasks data
  const getProjectTasksData = async () => {
    let { data, error } = await supabaseClient
      .from("project_tasks")
      .select("*")
      .eq("task_type_id", task_type_id);
    return data;
  };

  // The edit function to edit a task
  const handleEdit = () => {
    setTaskTypeData({
      task_type_id,
      task_name,
    });
    onUpdateOpen();
  };

  // The delete function to delete a task type
  const handleDelete = () => {
    setDeleteTaskTypeId(task_type_id);

    getProjectTasksData().then((results) => {
      if (results.length > 0) {
        onErrorOpen();
      } else {
        onDeleteOpen();
      }
    });
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

export default TaskTypeItem;
