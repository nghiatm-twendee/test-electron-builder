import { sha256sum } from "./nodeCrypto.js";
import { versions } from "./versions.js";
import { ipcRenderer } from "electron";

function send(channel: string, message: string) {
  return ipcRenderer.invoke(channel, message);
}

function openTxtFile(): Promise<{ filePath: string; content: string } | null> {
  return ipcRenderer.invoke("txt-file:open");
}

function saveTxtFile(handle: string, content: string): Promise<void> {
  return ipcRenderer.invoke("txt-file:save", handle, content);
}

function saveTxtFileAs(
  content: string,
  suggestedName: string,
): Promise<string | null> {
  return ipcRenderer.invoke("txt-file:save-as", content, suggestedName);
}

export { sha256sum, versions, send, openTxtFile, saveTxtFile, saveTxtFileAs };
