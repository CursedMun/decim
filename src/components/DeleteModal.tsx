import { type FC } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface IProps {
  open: boolean;
  changeIsOpen: (isOpen: boolean) => void;
  onCancel?: () => void;
  onDelete: () => void;
  warningText?: string;
  deleteText?: string;
}
export const DeleteModal: FC<IProps> = ({
  open,
  changeIsOpen,
  onDelete,
  onCancel,
  warningText,
  deleteText,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={changeIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{'are_you_shure'}</AlertDialogTitle>
          <AlertDialogDescription>
            {warningText ? warningText : 'are_you_shure_want_to_delete'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{'a_cancel'}</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            {deleteText ? deleteText : 'a_continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
