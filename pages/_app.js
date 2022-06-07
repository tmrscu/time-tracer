import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { supabaseClient } from '../utils/client'
import queryString from 'query-string'
import { AuthProvider } from '../context/Auth'
import "../styles/globals.css"

import { extendTheme } from '@chakra-ui/react'

// Theme for the UI
const theme = extendTheme({
  colors: {
    brand: {
      primary: '#635BFF',
      text: '#1D1D1D',
    },
  },
  components: {
    Switch: {
      baseStyle: {
        track: {
          _focus: {
            boxShadow: 'none'
          }
        }
      }
    }
  }
})

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  // Listener Method, which gives two events signed_in and signed_out
  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        handleAuthSession(event, session)

        const pathName = router.pathname
        // get the access_token from path

        // get the access_token from query string
        // const accessToken = queryString.parse(pathName.split('#')[1])
        // Get the access token from the query string
        const accessToken = {}
        accessToken = queryString.parse(router.asPath.split('#')[1])

        // if the event is signed_in and reset-password is in the URL then redirect to the reset-password page
        // whilst also setting the access_token in the query string
        if (event === 'SIGNED_IN' && router.pathname === '/reset-password') {
          // add access token as param
          router.push(
            `/reset-password?access_token=${accessToken.access_token}`
          )
        }

        // if the event is signed_in and reset-password is NOT in the URL then redirect to the index page
        if (event === 'SIGNED_IN' && accessToken == {}) {
          router.push('/')
        }
        
        // If signed out, push to sign in page
        if (event === 'SIGNED_OUT') {
          router.push('/signin')
        }
      }
    )

    return () => {
      authListener.unsubscribe()
    }
  }, [router])

  // Function to make the post request to AUTH api to set cookie
  const handleAuthSession = async (event, session) => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })
  }

  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  )
}

export default MyApp
