import {
  Container,
  Flex,
  Button,
  Heading,
  useDisclosure,
  Box,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
} from "@chakra-ui/react";

import React from 'react'

// eslint-disable-next-line react/display-name
const PrintInvoice = React.forwardRef((props, ref) => (
    <TableContainer ref={ref}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Item</Th>
            <Th>Duration</Th>
            <Th>Price</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.items.map((item) => (
            <Tr key={item.id}>
              <Td>{item.task_type}</Td>
              <Td>{item.duration}</Td>
              <Td>{item.hourly_rate}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
));

export default PrintInvoice;
