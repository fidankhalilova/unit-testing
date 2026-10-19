// Tests Modal visibility, close interactions, focus handling and accessibility attributes.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

const setup = (open = true) => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  const view = render(
    <Modal open={open} title="Confirm" onClose={onClose}>
      <p>Are you sure?</p>
    </Modal>,
  );
  return { user, onClose, view };
};

describe('Modal', () => {
  it('renders nothing when closed', () => {
    setup(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the title and content when open', () => {
    setup();
    expect(screen.getByRole('dialog', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('exposes dialog accessibility attributes', () => {
    setup();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('moves focus into the dialog on open', () => {
    setup();
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('closes on Escape', async () => {
    const { user, onClose } = setup();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape while closed', async () => {
    const { user, onClose } = setup(false);
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes when the Close button is clicked', async () => {
    const { user, onClose } = setup();
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop click but not on dialog click', async () => {
    const { user, onClose } = setup();
    await user.click(screen.getByText('Are you sure?'));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(screen.getByTestId('backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('lets the keyboard reach the Close button', async () => {
    const { user } = setup();
    await user.tab();
    expect(screen.getByRole('button', { name: /close/i })).toHaveFocus();
  });

  describe('focus restore', () => {
    let trigger: HTMLButtonElement;

    beforeEach(() => {
      trigger = document.createElement('button');
      document.body.append(trigger);
      trigger.focus();
    });

    afterEach(() => trigger.remove());

    it('returns focus to the trigger after closing', () => {
      const { view } = setup();
      view.rerender(
        <Modal open={false} title="Confirm" onClose={jest.fn()}>x</Modal>,
      );
      expect(trigger).toHaveFocus();
    });
  });

  it('matches the snapshot when open', () => {
    const { view } = setup();
    expect(view.asFragment()).toMatchSnapshot();
  });
});