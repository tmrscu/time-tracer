import { Box, Heading, Text, Image, Link } from '@chakra-ui/react'
import Header from '../components/Header'

// The Client Page
const Clients = () => {
  return (
    <>
      <Header />
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
          Clients Page Currently Under Construction
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
      ;
    </>
  )
}

export default Clients
