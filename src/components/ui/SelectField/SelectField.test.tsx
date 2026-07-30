import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Globe2 } from "lucide-react";
import { SelectField } from "./SelectField";

describe("SelectField", () => {
  it("uses a native keyboard-accessible select", async () => {
    const user = userEvent.setup();
    render(
      <SelectField
        label="Country"
        icon={<Globe2 />}
        options={[
          { value: "rw", label: "Rwanda" },
          { value: "ke", label: "Kenya" },
        ]}
      />,
    );
    const select = screen.getByRole("combobox", { name: /country/i });
    await user.selectOptions(select, "rw");
    expect(select).toHaveValue("rw");
  });
});