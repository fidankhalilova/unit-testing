// Fetches the item list from a public API; this is the boundary we mock in tests.
export type Item = { id: number; name: string };

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) throw new Error("Failed to load items");
  return res.json();
}
