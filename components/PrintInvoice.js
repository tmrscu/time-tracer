import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  UnorderedList,
  ListItem,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import React from "react";

// eslint-disable-next-line react/display-name
const PrintInvoice = React.forwardRef((props, ref) => {
  return (
    <TableContainer ref={ref} padding={30} bg="#ffffff">
      <Grid templateColumns="repeat(2, 1fr)">
        <GridItem w="100%">
          <Heading size="3xl">INVOICE</Heading>
        </GridItem>
        <GridItem w="100%">
          <UnorderedList
            fontWeight={500}
            fontSize={"16px"}
            lineHeight={"25px"}
            color={"#333"}
            listStyleType={"none"}
            textAlign={"right"}
            mb={10}
          >
            <ListItem>Invoice ID: {props.invoiceData.invoice_id}</ListItem>
            <ListItem>Start Date: {props.invoiceData.start_date}</ListItem>
            <ListItem>End Date: {props.invoiceData.end_date}</ListItem>
          </UnorderedList>
        </GridItem>
        <GridItem w="100%">
          <UnorderedList
            fontWeight={500}
            fontSize={"16px"}
            lineHeight={"25px"}
            color={"#333"}
            listStyleType={"none"}
            textAlign={"left"}
            ml={0}
            mb={10}
          >
            <ListItem>From:</ListItem>
            <ListItem>
              {props.profileData.first_name} {props.profileData.last_name}
            </ListItem>
            <ListItem>{props.profileData.role}</ListItem>
            <ListItem>{props.profileData.email}</ListItem>
          </UnorderedList>
        </GridItem>
        <GridItem w="100%">
          <UnorderedList
            fontWeight={500}
            fontSize={"16px"}
            lineHeight={"25px"}
            color={"#333"}
            listStyleType={"none"}
            textAlign={"right"}
            mb={10}
          >
            <ListItem>To:</ListItem>
            <ListItem>{props.clientData.company}</ListItem>
            <ListItem>
              {props.clientData.first_name} {props.clientData.last_name}
            </ListItem>
            <ListItem>{props.clientData.email}</ListItem>
          </UnorderedList>
        </GridItem>
      </Grid>

      <Table variant="unstyled" style={{ layout: "fixed" }}>
        <Thead>
          <Tr bg={"#eee"} fontWeight={700} borderBottom={"1px solid #ddd"}>
            <Th width={"33%"}>Item</Th>
            <Th width={"33%"} textAlign={"center"}>
              Duration
            </Th>
            <Th width={"33%"} textAlign={"right"}>
              Price
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.items.map((item, index) => (
            <Tr key={index} borderBottom={"1px solid #eee"}>
              <Td>{item.task_type}</Td>
              <Td textAlign={"center"}>{item.duration}</Td>
              <Td textAlign={"right"}>{item.price}</Td>
            </Tr>
          ))}
          <Tr borderTop={"2px solid #eee;"}>
            <Td></Td>
            <Td></Td>
            <Td fontWeight={700} textAlign={"right"}>
              Total: {props.invoiceTotal}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
});

export default PrintInvoice;
