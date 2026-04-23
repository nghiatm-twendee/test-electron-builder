import { openTxtFile, saveTxtFile, saveTxtFileAs } from "@app/preload";

export async function openFile() {
  const result = await openTxtFile();
  if (result === null) return null;
  const { filePath, content } = result;
  const name = filePath.split(/[\\/]/).pop() ?? filePath;

  return {
    id: crypto.randomUUID(),
    name: name,
    filePath,
    content,
    isDirty: false,
  };
}

export async function saveFile(filePath: string, content: string) {
  await saveTxtFile(filePath, content);
}

export async function saveFileAs(
  content: string,
  suggestedName = "untitled.txt",
) {
  return saveTxtFileAs(content, suggestedName);
}

export function newFile() {
  return {
    id: crypto.randomUUID(),
    name: "untitled.txt",
    filePath: null,
    content: "",
    isDirty: false,
  };
}
