import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button
  } from '@chakra-ui/react'
  
  const DeleteDialog = ({ isOpen, onOpen, onClose, title, deleteClient}) => {
    return (
        <>
        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                {title}
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure? You can&rsquo;t undo this action afterwards.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={deleteClient} ml={3}>
                  Delete Client
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }
  
  export default DeleteDialog