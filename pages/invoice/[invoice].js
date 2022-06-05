import { supabaseClient } from "../../utils/client";

const invoice = (props) => {
  // Get invoice and client data (only 1 set per invoice object)
  const invoice = props.data[0].invoices;
  const client = invoice.clients;

  // Store important invoice data as new objects in an array
  const invoiceData = [];
  props.data.forEach((data) =>
    // Construct new data object
    invoiceData.push({
      entry_notes: data.task_tracking.entry_notes,
      date: data.task_tracking.date,
      duration: data.task_tracking.duration,
      task_type: data.task_tracking.project_tasks.task_types.task_name,
      hourly_rate: data.task_tracking.project_tasks.projects.hourly_rate,
    })
  );

  return <div>{JSON.stringify(invoiceData)}</div>;
};

export async function getServerSideProps({ req, params }) {
  const { user, token } = await supabaseClient.auth.api.getUserByCookie(req);

  supabaseClient.auth.setAuth(token);

  // Get the invoice data and do a join with clients on client_id
  const { data, error } = await supabaseClient
    .from("invoice_data")
    .select(
      "*, task_tracking (*, project_tasks(*, projects!projects_project_id_fkey (*), task_types (*))), invoices!invoice_data_invoice_id_fkey (*, clients!client_id_fkey (*))"
    )
    .eq("invoice_id", params.invoice);

  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default invoice;
