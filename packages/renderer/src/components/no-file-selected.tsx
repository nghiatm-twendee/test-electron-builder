import { FilePlusIcon, FileTextIcon, FolderOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useNewFile } from "@/hooks/use-new-file";
import { useOpenFile } from "@/hooks/use-open-file";
import { FileAction, getShortcutDisplay } from "@/hooks/use-shortcuts";

const NoFileSelected = () => {
  const newFile = useNewFile();
  const openFile = useOpenFile();

  const handleNewFile = () => newFile();
  const handleOpenFile = () => openFile.mutate();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon />
        </EmptyMedia>
        <EmptyTitle>No file selected</EmptyTitle>
        <EmptyDescription>
          Create a new text file or open an existing one to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={handleNewFile}>
            <FilePlusIcon />
            New File
            <KbdGroup>
              {getShortcutDisplay({ action: FileAction.New }).map((k) => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </KbdGroup>
          </Button>
          <Button
            variant="outline"
            disabled={openFile.isPending}
            onClick={handleOpenFile}
          >
            <FolderOpenIcon />
            Open File
            <KbdGroup>
              {getShortcutDisplay({ action: FileAction.Open }).map((k) => (
                <Kbd key={k}>{k}</Kbd>
              ))}
            </KbdGroup>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};

export default NoFileSelected;
