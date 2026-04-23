import FocusableTextarea from "./components/focusable-textarea";
import NoFileSelected from "./components/no-file-selected";
import { useBeforeUnload } from "./hooks/use-before-unload";
import { useShortcuts } from "./hooks/use-shortcuts";
import { useFileStore } from "./stores/app-file-state.store";

function App() {
  useShortcuts();
  useBeforeUnload();

  const { openFiles, activeFileId, updateContent } = useFileStore();

  const activeFile = openFiles.find((f) => f.id === activeFileId);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeFile) updateContent(activeFile.id, e.target.value);
  };
  return (
    <>
      {activeFileId && activeFile ? (
        <FocusableTextarea
          className="h-[calc(100dvh-var(--spacing)*9)] w-full resize-none"
          value={activeFile.content}
          onChange={handleChange}
        />
      ) : (
        <NoFileSelected />
      )}
    </>
  );
}

export default App;
