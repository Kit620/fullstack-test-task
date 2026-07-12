import { useState } from "react";
import { uploadFile } from "@/api/files";

export function useUploadFile(onSuccess: () => void | Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function submit(title: string, file: File | null): Promise<boolean> {
    if (!title.trim() || !file) {
      setErrorMessage("Укажите название и выберите файл");
      return false;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await uploadFile(title.trim(), file);
      await onSuccess();
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Произошла ошибка");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, errorMessage };
}
