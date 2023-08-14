'use client';

import { cn } from '@/lib/utils';
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
});

import MarkdownIt from 'markdown-it';
import './editor.css';

import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { Label } from '../ui/label';

type TProps = {
  label?: string;
  error?: string;
  required?: boolean;
  id?: string;
  markdown?: string;
  onChange?: (markdown: string) => void;
  name?: string;
  containerClassName?: string;
};
const mdParser = new MarkdownIt(/* Markdown-it options */);

export function Editor(props: TProps) {
  const getContainerClassName = useCallback(() => {
    const customClasses = [];

    if (props.containerClassName) {
      customClasses.push(props.containerClassName);
    }

    return cn('grid w-full max-w-sm items-center gap-1.5', customClasses);
  }, [props.containerClassName]);

  return (
    <div className={getContainerClassName()}>
      {props.label ? (
        <Label htmlFor={props.id ? props.id : ''}>
          {props.label}{' '}
          {props.required && <span className={'text-destructive'}>*</span>}
        </Label>
      ) : null}
      <MdEditor
        className="!bg-primary text-primary"
        key={props.name}
        value={props.markdown}
        renderHTML={(text) => mdParser.render(text)}
        style={{
          height: '250px',
        }}
        onChange={(data) => props.onChange && props.onChange(data.html)}
      />
      {props.error ? (
        <Label
          className={'text-destructive'}
          htmlFor={props.id ? props.id : ''}
        >
          {props.error}
        </Label>
      ) : null}
    </div>
  );
}
