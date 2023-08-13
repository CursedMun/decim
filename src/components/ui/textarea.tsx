import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from './label';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  fullWidth?: boolean;
  label?: string;
  error?: string;
  hint?: string;
  containerStyles?: React.CSSProperties;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, ...props }, ref) => {
    const getContainerClassName = React.useCallback(() => {
      const customClasses = [];

      if (containerClassName) {
        customClasses.push(containerClassName);
      }

      if (props.fullWidth) {
        customClasses.push('max-w-full');
      }

      if (props.disabled) {
        customClasses.push('cursor-not-allowed opacity-50');
      }

      return cn('grid w-full max-w-sm items-center gap-1.5', customClasses);
    }, [containerClassName, props.disabled, props.fullWidth]);

    return (
      <div className={getContainerClassName()} style={props.containerStyles}>
        {props.label ? (
          <Label htmlFor={props.id ? props.id : ''}>
            {props.label}{' '}
            {props.required && <span className={'text-destructive'}>*</span>}
          </Label>
        ) : null}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {props.error ? (
          <Label
            className={'text-destructive'}
            htmlFor={props.id ? props.id : ''}
          >
            {props.error}
          </Label>
        ) : null}
        {!!props.hint && (
          <p className={'text-textSecondary mt-0.5 text-sm'}>{props.hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
