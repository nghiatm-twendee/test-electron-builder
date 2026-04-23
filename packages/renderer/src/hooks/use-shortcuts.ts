import { useHotkeys, type Options } from "react-hotkeys-hook";
import { useNewFile } from "./use-new-file";
import { useOpenFile } from "./use-open-file";
import { useSaveFile } from "./use-save-file";
import { useSaveFileAs } from "./use-save-file-as";
import { useCloseFile } from "./use-close-file";
import { useNavigateFile } from "./use-navigate-file";
import { useFileStore } from "@/stores/app-file-state.store";

export const FileAction = {
  New: "new",
  Open: "open",
  Save: "save",
  SaveAs: "saveAs",
  Close: "close",
  PrevFile: "prevFile",
  NextFile: "nextFile",
} as const;

export type FileAction = (typeof FileAction)[keyof typeof FileAction];

const ACTION_HOTKEYS: Record<FileAction, string> = {
  [FileAction.New]: "mod+alt+n",
  [FileAction.Open]: "mod+o",
  [FileAction.Save]: "mod+s",
  [FileAction.SaveAs]: "mod+shift+s",
  [FileAction.Close]: "mod+alt+w",
  [FileAction.PrevFile]: "alt+up",
  [FileAction.NextFile]: "alt+down",
};

function getDisplayKey(part: string): string {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
  if (part === "mod") return isMac ? "⌘" : "Ctrl";
  if (part === "shift") return "Shift";
  if (part === "alt") return isMac ? "⌥" : "Alt";
  if (part === "ctrl") return "Ctrl";
  if (part === "meta") return isMac ? "⌘" : "⊞";
  if (part === "up") return "↑";
  if (part === "down") return "↓";
  return part.toUpperCase();
}

export function getShortcutDisplay({
  action,
}: {
  action: FileAction;
}): string[] {
  return ACTION_HOTKEYS[action].split("+").map(getDisplayKey);
}

export function useShortcuts() {
  const newFile = useNewFile();
  const openFileMutation = useOpenFile();
  const saveFileMutation = useSaveFile();
  const saveFileAsMutation = useSaveFileAs();
  const closeFile = useCloseFile();
  const { navigatePrev, navigateNext } = useNavigateFile();

  const openFiles = useFileStore((s) => s.openFiles);
  const activeFileId = useFileStore((s) => s.activeFileId);
  const activeFile = openFiles.find((f) => f.id === activeFileId) ?? null;

  const opts: Options = { preventDefault: true, enableOnFormTags: true };

  useHotkeys(ACTION_HOTKEYS[FileAction.New], () => newFile(), opts);
  useHotkeys(
    ACTION_HOTKEYS[FileAction.Open],
    () => openFileMutation.mutate(),
    opts,
  );
  useHotkeys(
    ACTION_HOTKEYS[FileAction.Save],
    () => {
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
    },
    opts,
    [activeFile],
  );
  useHotkeys(
    ACTION_HOTKEYS[FileAction.SaveAs],
    () => {
      if (!activeFile) return;
      saveFileAsMutation.mutate({
        id: activeFile.id,
        content: activeFile.content,
        suggestedName: activeFile.name,
      });
    },
    opts,
    [activeFile],
  );
  useHotkeys(ACTION_HOTKEYS[FileAction.Close], () => closeFile(), opts);
  useHotkeys(ACTION_HOTKEYS[FileAction.PrevFile], () => navigatePrev(), opts, [
    openFiles,
    activeFileId,
  ]);
  useHotkeys(ACTION_HOTKEYS[FileAction.NextFile], () => navigateNext(), opts, [
    openFiles,
    activeFileId,
  ]);
}
