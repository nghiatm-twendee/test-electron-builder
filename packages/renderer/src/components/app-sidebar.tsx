import { useFileStore } from "@/stores/app-file-state.store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { focusTextarea } from "./focusable-textarea";
import type { OpenFile } from "@/types";
import { CircleIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const openFiles = useFileStore((s) => s.openFiles);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const setActiveFile = useFileStore((s) => s.setActiveFile);
  const closeFile = useFileStore((s) => s.closeFile);

  const handleSelectFile = (id: string) => () => {
    setActiveFile(id);
    focusTextarea();
  };

  const handleCloseFile = (file: OpenFile) => () => {
    if (file.isDirty) {
      const confirmed = window.confirm(
        `"${file.name}" has unsaved changes. Close anyway?`,
      );
      if (!confirmed) return;
    }
    closeFile(file.id);
    focusTextarea();
  };
  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {openFiles.map((file) => (
              <SidebarMenuItem key={file.id}>
                <SidebarMenuButton
                  isActive={file.id === activeFileId}
                  title={file.name}
                  onClick={handleSelectFile(file.id)}
                >
                  <CircleIcon
                    className={cn("fill-current", !file.isDirty && "opacity-0")}
                  />
                  <span>{file.name}</span>
                  {file.isDirty && (
                    <span className="sr-only">Unsaved changes</span>
                  )}
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover onClick={handleCloseFile(file)}>
                  <XIcon />
                  <span className="sr-only">Remove</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
