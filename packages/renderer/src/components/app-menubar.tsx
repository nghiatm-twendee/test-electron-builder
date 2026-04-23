import { ModeToggle } from "./mode-toggle";
import { Menubar } from "./ui/menubar";
import { SidebarTrigger } from "./ui/sidebar";

const AppMenubar = () => {
  return (
    <Menubar>
      <SidebarTrigger />
      <ModeToggle />
    </Menubar>
  );
};

export default AppMenubar;
