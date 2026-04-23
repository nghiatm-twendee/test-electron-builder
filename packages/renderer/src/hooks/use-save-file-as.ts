import { focusTextarea } from "@/components/focusable-textarea";
import { getErrorMessage } from "@/lib/error";
import { saveFileAs } from "@/services/txt-file";
import { useFileStore } from "@/stores/app-file-state.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type SaveFileAsVars = {
  id: string;
  content: string;
  suggestedName?: string;
};

export function useSaveFileAs() {
  const updateHandleName = useFileStore((s) => s.updateHandleName);
  const markClean = useFileStore((s) => s.markClean);

  return useMutation({
    mutationFn: ({ content, suggestedName }: SaveFileAsVars) =>
      saveFileAs(content, suggestedName),
    onSuccess: (filePath, { id }) => {
      if (!filePath) return;
      const filename = filePath.split(/[\\/]/).pop() ?? filePath;
      updateHandleName(id, filePath, filename);
      markClean(id);
      toast.success(`"${filename}" saved`);
      focusTextarea();
    },
    onError: (error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error(getErrorMessage({ error }));
    },
  });
}
