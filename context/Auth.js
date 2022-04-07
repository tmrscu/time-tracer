import { supabaseClient } from '../utils/client'
import React, { useContext, useState, useEffect } from 'react'

// Create a context
const AuthContext = React.createContext()

// Create useContext hook to access the context
export function useAuth() {
  return useContext(AuthContext)
}

// Create a provider component, which will wrap your app and make the context available
export function AuthProvider({ children }) {
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabaseClient.auth.session()

    // Set the user and loading status
    setUser(session?.user ?? null)
    setLoading(false)

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        console.log(event)
      }
    )

    return () => {
      listener?.unsubscribe()
    }
  }, [])

  // Will pass down the user and setUser
  const value = {
    user,
    setUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
