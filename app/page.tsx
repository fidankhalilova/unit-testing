// Demo page that renders FormInput, DataList and Modal together.
"use client";

import { useCallback, useState } from "react";
import DataList from "@/components/DataList";
import FormInput from "@/components/FormInput";
import Modal from "@/components/Modal";

const required = (v: string) => (v.trim() ? "" : "Email is required");

export default function Home() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <main className="mx-auto flex max-w-md flex-col gap-8 p-8">
      <FormInput label="Email" name="email" validate={required} />
      <DataList />
      <button
        onClick={() => setOpen(true)}
        className="rounded border px-3 py-2"
      >
        Open modal
      </button>
      <Modal open={open} title="Confirm" onClose={close}>
        <p>Are you sure?</p>
      </Modal>
    </main>
  );
}
