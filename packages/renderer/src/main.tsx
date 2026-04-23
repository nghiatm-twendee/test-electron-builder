import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import AppSidebar from "./components/app-sidebar.tsx";
import AppMenubar from "./components/app-menubar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            <AppMenubar />
            <App />
          </main>
          <Toaster richColors />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
