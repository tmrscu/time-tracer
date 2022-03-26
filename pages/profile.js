import { supabaseClient } from "../utils/client";
import Navbar from "../components/Navbar";

const profile = () => {
  const user = supabaseClient.auth.user();
  return (
    <div>
      <Navbar />
      <div>profile</div>
    </div>
  );
};

export default profile;
