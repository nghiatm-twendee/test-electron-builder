import { focusTextarea } from "@/components/focusable-textarea";
import { newFile } from "@/services/txt-file";
import { useFileStore } from "@/stores/app-file-state.store";

export function useNewFile() {
  const openFile = useFileStore((s) => s.openFile);
  return () => {
    openFile(newFile());
    focusTextarea();
  };
}
