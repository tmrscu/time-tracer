import { supabaseClient } from "../../utils/client";
import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useRouter } from "next/router";
import PrintInvoice from "../../components/PrintInvoice";
import { Box, Button, Center } from "@chakra-ui/react";
import { Container, Spinner } from "@chakra-ui/react";

const Invoice = (props) => {
  const router = useRouter();
  const componentRef = useRef();

  // Invoice data variables
  const [invoice, setInvoice] = useState(null);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [invoiceData, setInvoiceData] = useState({});
  const [clientData, setClientData] = useState({});
  const [profileData, setProfileData] = useState({});

  // Get data from Supabase
  const getInvoiceData = async () => {
    const id = router.query.id;
    const { data, error } = await supabaseClient
      .from("invoice_data")
      .select(
        "*, task_tracking (*, project_tasks(*, projects!projects_project_id_fkey (*), task_types (*))), invoices!invoice_data_invoice_id_fkey (*, clients!client_id_fkey (*, profiles (*)))"
      )
      .eq("invoice_id", id);

    // Return the sorted data
    return sortData(data);
  };

  // Sort data into invoice data, client data, profile data and grouped invoice data
  const sortData = (data) => {
    // Get inovice and client data
    setInvoiceData(data[0].invoices);
    setClientData(data[0].invoices.clients);
    setProfileData(data[0].invoices.clients.profiles);

    // Store important invoice data as new objects in a temp array
    const tempInvoiceData = [];
    if (data !== null) {
      data.forEach((data) =>
        // Construct new data object
        tempInvoiceData.push({
          entry_notes: data.task_tracking.entry_notes,
          date: data.task_tracking.date,
          duration: data.task_tracking.duration,
          task_type: data.task_tracking.project_tasks.task_types.task_name,
          hourly_rate: data.task_tracking.project_tasks.projects.hourly_rate,
        })
      );

      // Group the invoice data items by task type
      tempInvoiceData = tempInvoiceData.reduce((acc, item) => {
        const type = item.task_type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(item);
        return acc;
      }, {});

      // Store grouped invoice data and total invoice price
      const groupedInvoiceData = [];
      const invoiceTotalPrice = 0;
      // Loop through the grouped items
      tempInvoiceData = Object.entries(tempInvoiceData).forEach((data) => {
        let tempDuration = 0;
        let totalDuration = 0;
        let totalPrice = 0;

        // Calculate total duration and total price for the grouped item
        for (let i = 0; i < data[1].length; i++) {
          tempDuration =
            parseInt(data[1][i].duration.split(":")[0]) * 60 * 60 +
            parseInt(data[1][i].duration.split(":")[1]) * 60 +
            parseInt(data[1][i].duration.split(":")[2]);
          totalDuration = totalDuration + tempDuration;

          totalPrice =
            totalPrice + data[1][i].hourly_rate * (tempDuration / 3600);
        }

        // Convert total duration into HH:MM:SS format
        const tempEndTime = convert(totalDuration);
        const finalDuration = `${formatTime(tempEndTime.hours)}:${formatTime(
          tempEndTime.minutes
        )}:${formatTime(tempEndTime.seconds)}`;

        // Convert total price into $##.## format
        const finalPrice = formatPrice(totalPrice);

        // Add grouped item price to total invoice price
        invoiceTotalPrice = invoiceTotalPrice + totalPrice;

        // Construct new data object and add to grouped data array
        groupedInvoiceData.push({
          task_type: data[0],
          duration: finalDuration,
          price: finalPrice,
        });
      });
    }

    // Set total invoice price
    setInvoiceTotal(formatPrice(invoiceTotalPrice));

    // Return grouped invoice data array
    return groupedInvoiceData;
  };

  useEffect(() => {
    // Only run once the router has separated the id
    if (router.query.id != undefined) {
      getInvoiceData().then((results) => {
        setInvoice(results);
      });
    }
  }, [router.query.id]);

  // convert seconds to hours, minutes, and seconds
  const convert = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const secondsLeft = seconds - hours * 3600 - minutes * 60;
    return { hours, minutes, seconds: secondsLeft };
  };

  // Format time to ##
  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  // Format price to $##.##
  // https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
  const formatPrice = (price) => {
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(price);
  };

  return (
    <div>
      {!invoice ? (
        <Box bg="#f6f8fc" display="flex" justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.primary"
            size="xl"
            mt={36}
            border
          />
        </Box>
      ) : (
        <Box bg="#f6f8fc" display="flex" justifyContent="center">
          <Container maxW="6xl" h="100vh" paddingTop={"30px"}>
            <Center mb={"30px"}>
              <ReactToPrint
                trigger={() => (
                  <Button
                    bg="brand.primary"
                    color="white"
                    _hover={{ opacity: 0.8 }}
                  >
                    Print this Invoice
                  </Button>
                )}
                content={() => componentRef.current}
              />
            </Center>
            <Box border={"1px solid #ddd"}>
              <PrintInvoice
                items={invoice}
                invoiceData={invoiceData}
                clientData={clientData}
                profileData={profileData}
                invoiceTotal={invoiceTotal}
                ref={componentRef}
              />
            </Box>
          </Container>
        </Box>
      )}
    </div>
  );
};
export default Invoice;
