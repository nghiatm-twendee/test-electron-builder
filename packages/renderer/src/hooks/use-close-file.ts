import { focusTextarea } from "@/components/focusable-textarea";
import { useFileStore } from "@/stores/app-file-state.store";

export function useCloseFile() {
  const closeFile = useFileStore((s) => s.closeFile);
  const activeFileId = useFileStore((s) => s.activeFileId);

  return () => {
    if (!activeFileId) return;
    closeFile(activeFileId);
    focusTextarea();
  };
}
