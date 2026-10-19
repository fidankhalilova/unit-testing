// Accessible dialog: closes on Escape or backdrop click, focuses itself, restores focus on close.
'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type Props = { open: boolean; title: string; onClose: () => void; children: ReactNode };

export default function Modal({ open, title, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      data-testid="backdrop"
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black/50"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded bg-white p-6 text-black"
      >
        <h2 id="modal-title" className="mb-3 text-lg font-semibold">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-4 rounded border px-3 py-1">Close</button>
      </div>
    </div>
  );
}