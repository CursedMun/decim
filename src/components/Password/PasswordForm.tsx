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
import { type TPassword } from '@/infrastructure/tables/PasswordTable';
import { cn } from '@/lib/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

export default function PasswordForm({
  passwordEntity,
  children,
  showDialog,
  setShowDialog,
  refetch,
}: {
  passwordEntity?: TPassword;
  children: React.ReactNode;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  refetch: () => void;
}) {
  const [createAnother, setCreateAnother] = React.useState(false);
  const { alertSuccess, alertError } = useServerAlert();
  const { password } = useApp();

  console.log(passwordEntity);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: passwordEntity?.name || '',
      password: passwordEntity?.password || '',
      tags: passwordEntity?.tags || '',
      description: passwordEntity?.description || '',
    },
    onSubmit: async (values) => {
      password
        .save(
          passwordEntity?.id
            ? {
                ...values,
                id: passwordEntity?.id,
              }
            : values
        )
        .then(async () => {
          if (!createAnother) {
            setShowDialog(false);
          } else {
            formik.setValues({
              name: '',
              password: '',
              tags: formik.values.tags,
              description: '',
            });
          }
          alertSuccess()();
          refetch();
        })
        .catch(alertError);
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      password: Yup.string().required(),
      tags: Yup.string().required(),
    }),
  });

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{passwordEntity?.id ? 'save' : 'create'}</DialogTitle>
          <DialogDescription>
            Add a new password to your vault.
          </DialogDescription>
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
          <div className={cn(!passwordEntity?.id && 'flex justify-between')}>
            {!passwordEntity?.id && (
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
                {passwordEntity?.id ? 'a_save' : 'a_create'}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
