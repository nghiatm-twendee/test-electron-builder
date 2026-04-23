import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleIcon,
  FilePlusIcon,
  FolderOpenIcon,
  HardDriveDownloadIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./ui/menubar";
import { SidebarTrigger } from "./ui/sidebar";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useNewFile } from "@/hooks/use-new-file";
import { useOpenFile } from "@/hooks/use-open-file";
import { useSaveFile } from "@/hooks/use-save-file";
import { useSaveFileAs } from "@/hooks/use-save-file-as";
import { useCloseFile } from "@/hooks/use-close-file";
import { useNavigateFile } from "@/hooks/use-navigate-file";
import { useFileStore } from "@/stores/app-file-state.store";
import { FileAction, getShortcutDisplay } from "@/hooks/use-shortcuts";

const AppMenubar = () => {
  const newFile = useNewFile();
  const openFileMutation = useOpenFile();
  const saveFileMutation = useSaveFile();
  const saveFileAsMutation = useSaveFileAs();
  const closeFile = useCloseFile();
  const { navigatePrev, navigateNext } = useNavigateFile();

  const openFiles = useFileStore((s) => s.openFiles);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const activeFile = openFiles.find((f) => f.id === activeFileId) ?? null;
  const canNavigate = openFiles.length >= 2;

  const handleNew = () => newFile();
  const handleOpen = () => openFileMutation.mutate();
  const handleSave = () => {
    if (!activeFile) return;
    if (activeFile.filePath) {
      saveFileMutation.mutate({
        id: activeFile.id,
        filePath: activeFile.filePath,
        content: activeFile.content,
      });
    } else {
      saveFileAsMutation.mutate({
        id: activeFile.id,
        content: activeFile.content,
        suggestedName: activeFile.name,
      });
    }
  };
  const handleSaveAs = () => {
    if (!activeFile) return;
    saveFileAsMutation.mutate({
      id: activeFile.id,
      content: activeFile.content,
      suggestedName: activeFile.name,
    });
  };
  const handleClose = () => closeFile();
  const handlePrev = () => navigatePrev();
  const handleNext = () => navigateNext();
  return (
    <Menubar>
      <SidebarTrigger />
      <ModeToggle />
      <Button variant={"outline"} size={"icon"}>
        <a
          href="https://github.com/nghiatm-twendee/test-electron-builder"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGithub />
        </a>
      </Button>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent className="min-w-64">
          <MenubarItem onClick={handleNew}>
            <FilePlusIcon /> New
            <MenubarShortcut>
              {getShortcutDisplay({ action: FileAction.New }).join("+")}
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            disabled={openFileMutation.isPending}
            onClick={handleOpen}
          >
            <FolderOpenIcon /> Open
            <MenubarShortcut>
              {getShortcutDisplay({ action: FileAction.Open }).join("+")}
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            disabled={
              !activeFile ||
              saveFileMutation.isPending ||
              saveFileAsMutation.isPending
            }
            onClick={handleSave}
          >
            <SaveIcon /> Save
            <MenubarShortcut>
              {getShortcutDisplay({ action: FileAction.Save }).join("+")}
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            disabled={!activeFile || saveFileAsMutation.isPending}
            onClick={handleSaveAs}
          >
            <HardDriveDownloadIcon /> Save as
            <MenubarShortcut>
              {getShortcutDisplay({ action: FileAction.SaveAs }).join("+")}
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled={!activeFile} onClick={handleClose}>
            <XIcon /> Close
            <MenubarShortcut>
              {getShortcutDisplay({ action: FileAction.Close }).join("+")}
            </MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled={!canNavigate} onClick={handlePrev}>
            <ChevronUpIcon /> Previous File
            <MenubarShortcut>
              {getShortcutDisplay({ action: FileAction.PrevFile }).join("+")}
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled={!canNavigate} onClick={handleNext}>
            <ChevronDownIcon /> Next File
            <MenubarShortcut>
              {getShortcutDisplay({ action: FileAction.NextFile }).join("+")}
            </MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      {activeFile && (
        <span
          className="flex min-w-0 flex-1 items-center gap-1 px-1 md:sr-only"
          title={activeFile.name}
        >
          <span className="truncate text-sm">{activeFile.name}</span>
          {activeFile.isDirty && (
            <>
              <CircleIcon className="size-2 shrink-0 fill-current" />
              <span className="sr-only">Unsaved changes</span>
            </>
          )}
        </span>
      )}
    </Menubar>
  );
};

export default AppMenubar;
