// Tests DataList states, retry and debounced search with a mocked API and fake timers.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataList from '../DataList';
import { fetchItems } from '@/lib/api';

jest.mock('@/lib/api');
const mockFetch = jest.mocked(fetchItems);
const items = [{ id: 1, name: 'Apple' }, { id: 2, name: 'Banana' }];

const setup = () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(<DataList />);
  return user;
};

beforeEach(() => {
  jest.useFakeTimers();
  mockFetch.mockResolvedValue(items);
});

afterEach(() => {
  jest.useRealTimers();
  jest.resetAllMocks();
});

describe('DataList', () => {
  it('shows a loading state, then the items', async () => {
    setup();
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
    expect(await screen.findAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows an empty state when the API returns nothing', async () => {
    mockFetch.mockResolvedValue([]);
    setup();
    expect(await screen.findByText(/no items found/i)).toBeInTheDocument();
  });

  it('shows an error, and Retry loads the items', async () => {
    mockFetch.mockRejectedValueOnce(new Error('boom'));
    const user = setup();
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load/i);

    await user.click(screen.getByRole('button', { name: /retry/i }));

    expect(await screen.findByText('Apple')).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('filters only after the debounce delay', async () => {
    const user = setup();
    await user.type(await screen.findByLabelText(/search/i), 'ban');
    expect(screen.getByText('Apple')).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText('Apple')).not.toBeInTheDocument());
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('matches the search case-insensitively', async () => {
    const user = setup();
    await user.type(await screen.findByLabelText(/search/i), 'BAN');
    await waitFor(() => expect(screen.queryByText('Apple')).not.toBeInTheDocument());
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('shows the empty state when nothing matches the search', async () => {
    const user = setup();
    await user.type(await screen.findByLabelText(/search/i), 'zzz');
    expect(await screen.findByText(/no items found/i)).toBeInTheDocument();
  });

  it('lets the keyboard reach the search field', async () => {
    const user = setup();
    const search = await screen.findByLabelText(/search/i);
    await user.tab();
    expect(search).toHaveFocus();
  });
});