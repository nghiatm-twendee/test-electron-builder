export type OpenFile = {
  id: string; // random id you generate, the key for everything
  name: string; // "notes.txt" — for display in the tab
  filePath: string | null; // null if not saved yet
  content: string; // the actual text, lives in memory
  isDirty: boolean; // true if unsaved changes exist
};
