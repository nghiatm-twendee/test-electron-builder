import { dialog, ipcMain } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { AppModule } from "../AppModule.js";
import { ModuleContext } from "../ModuleContext.js";

export class TxtFileModule implements AppModule {
  enable(context: ModuleContext): Promise<void> | void {
    ipcMain.handle("txt-file:open", async () => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "Text files", extensions: ["txt"] }],
      });

      if (canceled || filePaths.length === 0) return null;

      const filePath = filePaths[0];
      const content = await readFile(filePath, "utf8");

      return {
        filePath,
        content,
      };
    });

    ipcMain.handle("txt-file:save", async (event, handle, content) => {
      await writeFile(handle, content);
    });

    ipcMain.handle(
      "txt-file:save-as",
      async (event, content, suggestedName = "untitled.txt") => {
        const { canceled, filePath } = await dialog.showSaveDialog({
          defaultPath: suggestedName,
          filters: [{ name: "Text files", extensions: ["txt"] }],
        });

        if (canceled || filePath === undefined) return null;

        await writeFile(filePath, content);

        return filePath;
      },
    );
  }
}

export function createTxtFileModule() {
  return new TxtFileModule();
}
