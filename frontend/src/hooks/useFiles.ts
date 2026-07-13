import { useCallback, useEffect, useState } from "react";
import { deleteFile, getFiles } from "@/api/files";
import type { FileItem } from "@/types/file";

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setFiles(await getFiles());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const remove = useCallback(
    async (fileId: string) => {
      setDeletingId(fileId);
      setErrorMessage(null);
      try {
        await deleteFile(fileId);
        await reload();
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Произошла ошибка");
      } finally {
        setDeletingId(null);
      }
    },
    [reload],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return { files, isLoading, errorMessage, deletingId, reload, remove };
}
