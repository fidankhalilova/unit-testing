// Tests blur-first validation, accessibility wiring and a UI snapshot for FormInput.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "../FormInput";

const required = (v: string) => (v ? "" : "Email is required");

const setup = () => {
  const user = userEvent.setup();
  const view = render(
    <FormInput label="Email" name="email" validate={required} />,
  );
  return { user, view, input: screen.getByLabelText("Email") };
};

describe("FormInput", () => {
  it("shows no error while the user is still in the field", async () => {
    const { user, input } = setup();
    await user.click(input);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error after leaving an empty field", async () => {
    const { user, input } = setup();
    await user.click(input);
    await user.tab();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /email is required/i,
    );
  });

  it("clears the error once the value becomes valid", async () => {
    const { user, input } = setup();
    await user.click(input);
    await user.tab();
    await screen.findByRole("alert");
    await user.type(input, "a");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("binds the error to the input for assistive technology", async () => {
    const { user, input } = setup();
    expect(input).toHaveAttribute("aria-invalid", "false");
    await user.click(input);
    await user.tab();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/email is required/i);
  });

  it("is reachable with the keyboard", async () => {
    const { user, input } = setup();
    await user.tab();
    expect(input).toHaveFocus();
  });

  it("matches the snapshot in the error state", async () => {
    const { user, view, input } = setup();
    await user.click(input);
    await user.tab();
    expect(view.asFragment()).toMatchSnapshot();
  });
});
