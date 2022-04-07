// API to set the authentication cookie
import { supabaseClient } from '../../utils/client'

export default function handler(req, res) {
  supabaseClient.auth.api.setAuthCookie(req, res)
}
