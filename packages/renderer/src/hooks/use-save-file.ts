import { focusTextarea } from "@/components/focusable-textarea";
import { getErrorMessage } from "@/lib/error";
import { saveFile } from "@/services/txt-file";
import { useFileStore } from "@/stores/app-file-state.store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type SaveFileVars = {
  id: string;
  filePath: string;
  content: string;
};

export function useSaveFile() {
  const markClean = useFileStore((s) => s.markClean);

  return useMutation({
    mutationFn: ({ filePath, content }: SaveFileVars) =>
      saveFile(filePath, content),
    onSuccess: (_, { id, filePath }) => {
      const filename = filePath.split(/[\\/]/).pop() ?? filePath;
      markClean(id);
      toast.success(`"${filename}" saved`);
      focusTextarea();
    },
    onError: (error) => {
      toast.error(getErrorMessage({ error }));
    },
  });
}
