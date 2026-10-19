# Unit Testing Core Components

Jest and React Testing Library only. Next.js (TypeScript) and Tailwind.

## Scripts

| Command | Purpose |
|---|---|
| `npm test` | Run all tests once |
| `npm run test:watch` | Re-run affected tests while coding |
| `npm run test:ci` | CI mode: coverage, and snapshots are never auto-written |
| `npm run ci` | Local CI simulation: lint, type-check, then tests |

## What I tested and why

**FormInput**
- No error before the first blur, so users aren't told they're wrong mid-typing.
- Error after blur, cleared as soon as the value is valid.
- `aria-invalid` and `aria-describedby` wiring, checked via `toHaveAccessibleDescription`.
- Keyboard focus, plus one snapshot of the error state.

**DataList** (API mocked with `jest.mock`, timers faked)
- Loading, ready, empty (API and search) and error states.
- Retry after failure.
- Search filters only after the 300ms debounce.

**Modal**
- Hidden when closed, labelled `role="dialog"` when open.
- Closes on Escape, Close button and backdrop click, but not on a click inside the dialog.
- Focus moves in on open and returns to the trigger on close.
- One snapshot of the open state.

## Notes
- Queries follow the priority order: `getByRole`, `getByLabelText`, text. The only `getByTestId` is the Modal backdrop, which has no role or label.
- `queryBy*` for absence, `findBy*` for async, awaited `userEvent` throughout.
- Coverage is a signal, not a target.