import { toast } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <p>Test</p>
      <Button
        onClick={() => {
          toast.success("Hello");
        }}
      >
        Hello
      </Button>
    </ThemeProvider>
  );
}

export default App;
