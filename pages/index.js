import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { supabaseClient } from '../utils/client'
import styles from '../styles/Home.module.css'
import { Box, Heading, Text, Image, Link } from '@chakra-ui/react'
import Navbar from '../components/Navbar'

export default function Home() {
  const router = useRouter()
  const user = supabaseClient.auth.user()

  // useEffect runs, pushes to signin page if no user
  useEffect(() => {
    if (!user) {
      router.push('/signin')
    }
  }, [user, router])

  // Returns an empty div if theres no user
  // Prevents page flash
  if (!user) {
    return <div></div>
  }

  // The index page
  return (
    <div className={styles.container}>
      <Navbar />
      <Box
        color={'black'}
        display='flexbox'
        height='min-content'
        alignItems={'center'}
        textAlign='center'
        px={12}
        py={5}
        ml={'auto'}
        mr={'auto'}
        mt={45}>
        <Heading
          as='h1'
          fontSize='4xl'
          color={'black'}
          mb={5}>
          Homepage Currently Under Construction
        </Heading>
        <Text>
          This page is currently being worked on by our developers. Please check
          back later when the work is complete.
        </Text>
        <Image
          src='/work-in-progress.png'
          boxSize='200px'
          mt={50}
          mb={10}
          ml={'auto'}
          mr={'auto'}
          alt='in progress'
        />
        <Link
          href='https://www.flaticon.com/free-icons/work-in-progress'
          title='work in progress icons'
          color={'brand.primary'}
          isExternal>
          Work in progress icons created by Freepik - Flaticon
        </Link>
      </Box>
    </div>
  )
}
