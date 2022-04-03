import { supabaseClient } from "../utils/client";

const getProfileData = async (user) => {
    let { data, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("profile_id", user?.id);

    //
    return data
  };


export default getProfileData