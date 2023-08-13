import { type InputProps } from '@/lib/localTypes';
import { cn } from '@/lib/utils';
import debounce from 'lodash.debounce';
import React, { useCallback, type ChangeEvent, type ReactNode } from 'react';
import { Label } from './label';

interface IProps extends InputProps {
  label?: string;
  error?: string;
  id?: string;
  containerStyles?: React.CSSProperties;
  containerClassName?: string;
  hint?: string;
  debounce?: number;
  fullWidth?: boolean;
  leftIcon?: {
    icon: ReactNode;
    onClick: () => void;
  };
}

const Input = React.forwardRef<HTMLInputElement, IProps>(
  ({ className, containerClassName, type, leftIcon, ...props }, ref) => {
    const getContainerClassName = useCallback(() => {
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

    const getInputClassName = useCallback(() => {
      const customClasses = [];

      if (className) {
        customClasses.push(className);
      }

      if (props.error) {
        customClasses.push('border-error');
      }

      if (leftIcon) {
        customClasses.push('pr-12');
      }

      return cn(
        'hover:bg-accent hover:text-accent-foreground flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        customClasses
      );
    }, [className, props.error]);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        props.onChange && props.onChange(event);
      },
      [props]
    );

    const debouncedOnChange = debounce(
      () => props.onChange && props.onChange,
      props.debounce || 500
    );

    return (
      <div className={getContainerClassName()} style={props.containerStyles}>
        {props.label ? (
          <Label htmlFor={props.id ? props.id : ''}>
            {props.label}{' '}
            {props.required && <span className={'text-destructive'}>*</span>}
          </Label>
        ) : null}
        <div className={'relative'}>
          <input
            type={type}
            className={getInputClassName()}
            ref={ref}
            onChange={props.debounce ? debouncedOnChange : handleChange}
            {...props}
          />
          {!!leftIcon && (
            <div
              className={
                'absolute right-0 top-0 flex h-full w-10 cursor-pointer items-center justify-center'
              }
              onClick={leftIcon.onClick}
            >
              {leftIcon.icon}
            </div>
          )}
        </div>
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

export default React.memo(Input);
