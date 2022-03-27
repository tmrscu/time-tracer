import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPBASE_SERVICE_KEY = process.env.SERVICE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPBASE_SERVICE_KEY);

export default async function handler(req, res) {
  try {
    const { user, error } = await supabaseAdmin.auth.api.deleteUser(
      req.body.userData.id
    );
    res.status(200).end();
  } catch (error) {
    res.status(400).end();
  }
}