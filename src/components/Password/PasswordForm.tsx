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
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { useFormik } from 'formik';
import { ChevronDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as Yup from 'yup';
import { Checkbox } from '../ui/checkbox';
import { Collapsible } from '../ui/collapsible';
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
  const [isOpen, setIsOpen] = React.useState(false);

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
          alertSuccess();
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
            {!!passwordEntity?.id && (
              <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="space-y-2 border-secondary border bg-secondary rounded-2xl"
              >
                <div className="flex items-center justify-between space-x-4 px-4">
                  <h4 className="text-sm font-semibold">
                    Show password qr code
                  </h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-all duration-300 transform',
                          {
                            'rotate-180': isOpen,
                          }
                        )}
                      />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className=" flex space-y-2 w-full justify-center self-center text-center items-center">
                  <QRCodeSVG
                    className="self-center my-4"
                    value={passwordEntity.password}
                  />
                </CollapsibleContent>
              </Collapsible>
            )}
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
