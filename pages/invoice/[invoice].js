import { supabaseClient } from "../../utils/client";

const invoice = (props) => {
  return (
    <div>{JSON.stringify(props)}</div>
  )
}


export async function getServerSideProps({ req, params }) {
  const { user, token } = await supabaseClient.auth.api.getUserByCookie(req);

  supabaseClient.auth.setAuth(token);

  const {data, error} = await supabaseClient
  .from("invoices")
  .select("*, invoice_data!invoice_id_fkey (*)")
  .eq("invoice_id", params.invoice); 

  return {
    props: {} // will be passed to the page component as props
  }
}

export default invoice