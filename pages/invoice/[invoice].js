import { supabaseClient } from "../../utils/client";
import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useRouter } from "next/router";
import PrintInvoice from "../../components/PrintInvoice";
import { Box, Button, Center } from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";

const Invoice = (props) => {
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [invoiceData, setInvoiceData] = useState({});
  const [clientData, setClientData] = useState({});

  const componentRef = useRef();

  const getInvoiceData = async () => {
    const id = router.query.id;
    const { data, error } = await supabaseClient
      .from("invoice_data")
      .select(
        "*, task_tracking (*, project_tasks(*, projects!projects_project_id_fkey (*), task_types (*))), invoices!invoice_data_invoice_id_fkey (*, clients!client_id_fkey (*))"
      )
      .eq("invoice_id", id);

    return sortData(data);
  };

  const sortData = (data) => {
    // Get inovice and client data
    setInvoiceData(data[0].invoices);
    setClientData(data[0].invoices.clients);

    // Store important invoice data as new objects in an array
    const invoiceData = [];
    if (data !== null) {
      data.forEach((data) =>
        // Construct new data object
        invoiceData.push({
          entry_notes: data.task_tracking.entry_notes,
          date: data.task_tracking.date,
          duration: data.task_tracking.duration,
          task_type: data.task_tracking.project_tasks.task_types.task_name,
          hourly_rate: data.task_tracking.project_tasks.projects.hourly_rate,
        })
      );

      // create an array of items grouped by task type
      invoiceData = invoiceData.reduce((acc, item) => {
        const type = item.task_type;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(item);
        return acc;
      }, {});

      const groupedInvoiceData = [];
      const invoiceTotalPrice = 0;
      invoiceData = Object.entries(invoiceData).forEach((data) => {
        let tempDuration = 0;
        let totalDuration = 0;
        let totalPrice = 0;

        for (let i = 0; i < data[1].length; i++) {
          tempDuration =
            parseInt(data[1][i].duration.split(":")[0]) * 60 * 60 +
            parseInt(data[1][i].duration.split(":")[1]) * 60 +
            parseInt(data[1][i].duration.split(":")[2]);
          totalDuration = totalDuration + tempDuration;

          totalPrice =
            totalPrice + data[1][i].hourly_rate * (tempDuration / 3600);
        }

        const tempEndTime = convert(totalDuration);
        const finalDuration = `${formatTime(tempEndTime.hours)}:${formatTime(
          tempEndTime.minutes
        )}:${formatTime(tempEndTime.seconds)}`;
        const finalPrice = formatPrice(totalPrice);
        invoiceTotalPrice = invoiceTotalPrice + totalPrice;

        // Construct new data object
        groupedInvoiceData.push({
          task_type: data[0],
          duration: finalDuration,
          price: finalPrice,
        });
      });
    }

    // Set total invoice price
    setInvoiceTotal(formatPrice(invoiceTotalPrice));
    return groupedInvoiceData;
  };

  useEffect(() => {
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

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  const formatPrice = (price) => {
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(price);
  };

  return (
    <div>
      {!invoice ? (
        <div>Loading...</div>
      ) : (
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
              invoiceTotal={invoiceTotal}
              ref={componentRef}
            />
          </Box>
        </Container>
      )}
    </div>
  );
};
export default Invoice;
