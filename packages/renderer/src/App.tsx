import { toast } from "sonner";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <p>Test</p>
      <Button
        onClick={() => {
          toast.success("Hello");
        }}
      >
        Hello
      </Button>
    </>
  );
}

export default App;
