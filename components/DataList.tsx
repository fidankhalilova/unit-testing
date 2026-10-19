// Async list with loading, error (with retry), empty and debounced-search states.
'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchItems, type Item } from '@/lib/api';

type State = { status: 'loading' | 'error' | 'ready'; items: Item[] };

export default function DataList() {
  const [state, setState] = useState<State>({ status: 'loading', items: [] });
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const load = useCallback(() => {
    fetchItems()
      .then((items) => setState({ status: 'ready', items }))
      .catch(() => setState({ status: 'error', items: [] }));
  }, []);

  const retry = () => {
    setState({ status: 'loading', items: [] });
    load();
  };

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const id = setTimeout(() => setQuery(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  if (state.status === 'loading') return <p role="status">Loading…</p>;

  if (state.status === 'error') {
    return (
      <div role="alert" className="flex items-center gap-3 text-red-600">
        <span>⚠ Could not load items.</span>
        <button onClick={retry} className="rounded border px-3 py-1">Retry</button>
      </div>
    );
  }

  const visible = state.items.filter((i) =>
    i.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="search" className="text-sm font-medium">Search</label>
      <input
        id="search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded border px-3 py-2"
      />
      {visible.length ? (
        <ul className="list-disc pl-5">
          {visible.map((i) => <li key={i.id}>{i.name}</li>)}
        </ul>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}