import { LiveCheckForm } from "./LiveCheckForm";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
describe("LiveCheckForm", () => {
  it("states that the camera is not opened", () => {
    render(<LiveCheckForm />);
    expect(screen.getByText(/never opens the camera/i)).toBeInTheDocument();
  });
});
