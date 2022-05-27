import { useState, useEffect } from "react";
import { supabaseClient } from "../utils/client";
import { Flex, Select } from "@chakra-ui/react";

const TimerSelects = ({ setClientID, setProjectID, setTaskTypeID }) => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [tempClientID, setTempClientID] = useState(null);
  const [tempProjectID, setTempProjectID] = useState(null);
  const [tempTaskTypeID, setTempTaskTypeID] = useState(null);

  const getClientData = async () => {
    let { data: clients, error } = await supabaseClient
      .from("clients")
      .select("*")
      .eq("status", true)
      .order("company", { ascending: true });
    return clients;
  };

  const getProjectData = async () => {
    let { data: projects, error } = await supabaseClient
      .from("projects")
      .select(`*, clients!clients_client_id_fkey (*)`)
      .eq("status", true)
      .order("client_id", { ascending: true });
    return projects;
  };

  const getTaskTypeData = async () => {
    let { data: tasks, error } = await supabaseClient
      .from("task_types")
      .select("*")
      .order("task_name", { ascending: true });
    return tasks;
  };

  useEffect(() => {
    getClientData().then((results) => {
      setClients(results);
    });
    getProjectData().then((results) => {
      setProjects(results);
    });
    getTaskTypeData().then((results) => {
      setTaskTypes(results);
    });

    console.log(tempClientID);
  }, []);

  return (
    <Flex maxW={"xl"} mt={3} gap={2}>
      <Select
        name="client"
        type="client"
        autoComplete="client"
        required
        mb={6}
        size="sm"
        onChange={(e) => {
          setClientID(e.target.value);
          setTempClientID(e.target.value);
        }}
      >
        <option key="all" value="">
          Select a Client
        </option>
        {clients.length > 0 ? (
          clients.map((client, index) => {
            return (
              <option key={index} value={client.client_id}>
                {client.company}
              </option>
            );
          })
        ) : (
          <></>
        )}
      </Select>
      <Select
        name="projects"
        type="projects"
        autoComplete="projects"
        required
        mb={6}
        size="sm"
        isDisabled={tempClientID == null || tempClientID == "" ? true : false}
        onChange={(e) => {
          setProjectID(e.target.value);
          setTempProjectID(e.target.value);
        }}
      >
        <option key="all" value="">
          Select a Project
        </option>
        {projects.length > 0 ? (
          projects.filter((project) => project.client_id == tempClientID).map((project, index) => {
            return (
              <option key={index} value={project.project_id}>
                {project.project_name}
              </option>
            );
          })
        ) : (
          <></>
        )}
      </Select>
      <Select
        name="task_types"
        type="tasdk_types"
        autoComplete="task_types"
        required
        mb={6}
        size="sm"
        onChange={(e) => setTaskTypeID(e.target.value)}
      >
        <option key="all" value="">
          Select a Task Type
        </option>
        {taskTypes.length > 0 ? (
          taskTypes.map((task, index) => {
            return (
              <option key={index} value={task.task_type_id}>
                {task.task_name}
              </option>
            );
          })
        ) : (
          <></>
        )}
      </Select>
    </Flex>
  );
};

export default TimerSelects;
