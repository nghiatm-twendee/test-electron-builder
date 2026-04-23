import type { OpenFile } from "@/types";
import { create } from "zustand";

type FileStore = {
  openFiles: OpenFile[];
  activeFileId: string | null;

  openFile: (file: OpenFile) => void;
  closeFile: (id: string) => void;
  setActiveFile: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  updateHandleName: (id: string, filePath: string | null, name: string) => void;
  markClean: (id: string) => void;
};

export const useFileStore = create<FileStore>((set) => ({
  openFiles: [],
  activeFileId: null,

  openFile: (file) =>
    set((state) => ({
      openFiles: [...state.openFiles, file],
      activeFileId: file.id,
    })),

  closeFile: (id) =>
    set((state) => {
      const remaining = state.openFiles.filter((f) => f.id !== id);
      return {
        openFiles: remaining,
        activeFileId: remaining.at(-1)?.id ?? null,
      };
    }),

  setActiveFile: (id) => set({ activeFileId: id }),

  updateContent: (id, content) =>
    set((state) => ({
      openFiles: state.openFiles.map((f) =>
        f.id === id ? { ...f, content, isDirty: true } : f,
      ),
    })),

  updateHandleName: (id, filePath, name) =>
    set((state) => ({
      openFiles: state.openFiles.map((f) =>
        f.id === id ? { ...f, filePath, name } : f,
      ),
    })),

  markClean: (id) =>
    set((state) => ({
      openFiles: state.openFiles.map((f) =>
        f.id === id ? { ...f, isDirty: false } : f,
      ),
    })),
}));
