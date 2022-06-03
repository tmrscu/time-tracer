import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

// The delete alert dialog used task types that cannot be deleted
const DeleteErrorDialog = ({ isOpen, onClose, title, errorMessage }) => {
  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
            <AlertDialogBody>
              {errorMessage}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteErrorDialog;
