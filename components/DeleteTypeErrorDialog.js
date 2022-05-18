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
const DeleteTypeErrorDialog = ({ isOpen, onClose, title }) => {
  return (
    <>
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
            <AlertDialogBody>
              This Task Type cannot be deleted because it is linked to a Project. Please contact the Time Tracer team for more information.
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

export default DeleteTypeErrorDialog;
