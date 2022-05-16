import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

// The delete alert dialog used for all delete functions
const DeleteDialog = ({ isOpen, onClose, title, type, deleteFunction }) => {
  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can&rsquo;t undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              {/* Fire the delete function on click */}
              <Button colorScheme="red" onClick={deleteFunction} ml={3}>
                {`Delete ${type}`}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteDialog;
