'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Input from '@/components/ui/input';
import { useApp } from '@/hooks/useApp';
import { useServerAlert } from '@/hooks/useServerAlert';
import { type TNote } from '@/infrastructure/tables/NoteTable';
import { cn } from '@/lib/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

export default function NoteForm({
  noteEntity,
  children,
  showDialog,
  setShowDialog,
  refetch,
}: {
  noteEntity?: TNote;
  children: React.ReactNode;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  refetch: () => void;
}) {
  const [createAnother, setCreateAnother] = React.useState(false);
  const { alertSuccess, alertError } = useServerAlert();
  const { note } = useApp();

  console.log({ noteEntity });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: noteEntity?.title || '',
      tags: noteEntity?.tags || '',
      description: noteEntity?.description || '',
    },
    onSubmit: async (values) => {
      note
        .save(
          noteEntity?.id
            ? {
                ...values,
                id: noteEntity?.id,
              }
            : values
        )
        .then(async () => {
          if (!createAnother) {
            setShowDialog(false);
          } else {
            formik.setValues({
              title: '',
              tags: formik.values.tags,
              description: '',
            });
          }
          alertSuccess();
          refetch();
        })
        .catch(alertError);
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      description: Yup.string().required(),
      tags: Yup.string().required(),
    }),
  });

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog} modal={true}>
      {children}
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{noteEntity?.id ? 'save' : 'create'}</DialogTitle>
          <DialogDescription>Add a new note to your vault.</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            {Object.entries(formik.values).map(([key, value], i) => {
              const typedKey = key as keyof typeof formik.values;

              if (typedKey === 'description') return null;

              return (
                <Input
                  key={i}
                  value={value}
                  onChange={formik.handleChange}
                  name={typedKey}
                  id={`${typedKey}-input`}
                  label={typedKey}
                  placeholder={typedKey}
                  required={true}
                  error={
                    (formik.touched[typedKey] && formik.errors[typedKey]) || ''
                  }
                  containerClassName={'max-w-full mt-6'}
                />
              );
            })}
            <Textarea
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              name={'description'}
              id={`description-input`}
              label={'description'}
              placeholder={'description'}
              required={true}
              error={
                (formik.touched['description'] &&
                  formik.errors['description']) ||
                ''
              }
              containerClassName={'max-w-full mt-6'}
            />
          </div>
          <div className={cn(!noteEntity?.id && 'flex justify-between')}>
            {!noteEntity?.id && (
              <div
                className="flex items-center hover:cursor-pointer"
                onClick={() => setCreateAnother(!createAnother)}
              >
                <Checkbox checked={createAnother} />
                <span className="ml-2">Create another</span>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                a_cancel
              </Button>
              <Button onClick={() => formik.handleSubmit()}>
                {noteEntity?.id ? 'a_save' : 'a_create'}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
