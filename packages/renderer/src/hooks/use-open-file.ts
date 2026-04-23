import { focusTextarea } from "@/components/focusable-textarea";
import { getErrorMessage } from "@/lib/error";
import { openFile } from "@/services/txt-file";
import { useFileStore } from "@/stores/app-file-state.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useOpenFile() {
  const storeOpenFile = useFileStore((s) => s.openFile);

  return useMutation({
    mutationFn: openFile,
    onSuccess: (file) => {
      if (!file) return;
      storeOpenFile(file);
      toast.success(`"${file.name}" opened`);
      focusTextarea();
    },
    onError: (error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error(getErrorMessage({ error }));
    },
  });
}
