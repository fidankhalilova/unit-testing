// Labelled input that validates on first blur, then revalidates on every change.
'use client';

import { useState } from 'react';

type Props = {
  label: string;
  name: string;
  validate: (value: string) => string;
};

export default function FormInput({ label, name, validate }: Props) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const error = touched ? validate(value) : '';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="rounded border px-3 py-2 aria-invalid:border-red-600"
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="text-sm text-red-600">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}