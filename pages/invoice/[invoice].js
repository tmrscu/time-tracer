import { supabaseClient } from "../../utils/client";
import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { useRouter } from "next/router";
import PrintInvoice from "../../components/PrintInvoice";
import { Button } from "@chakra-ui/react";

const Invoice = (props) => {
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);

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
    }

    return invoiceData;
  };

  useEffect(() => {
    getInvoiceData().then((results) => {
      setInvoice(results);
    });
  }, [router.query.id]);

  return (
    <div>
      {!invoice ? (
        <div>Loading...</div>
      ) : (
        <>
          <ReactToPrint trigger={() => <Button>Print this out!</Button>} content={() => componentRef.current} />
          <PrintInvoice items={invoice} ref={componentRef} />
        </>
      )}
    </div>
  );
};
export default Invoice;
