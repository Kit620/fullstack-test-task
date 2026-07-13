import { apiUrl } from "./client";
import type { FileItem } from "@/types/file";

export async function getFiles(): Promise<FileItem[]> {
  const response = await fetch(apiUrl("/files"), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Не удалось загрузить данные");
  }
  return response.json();
}

export async function uploadFile(title: string, file: File): Promise<FileItem> {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);

  const response = await fetch(apiUrl("/files"), {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Не удалось загрузить файл");
  }
  return response.json();
}

export function downloadFileUrl(fileId: string): string {
  return apiUrl(`/files/${fileId}/download`);
}

export async function deleteFile(fileId: string): Promise<void> {
  const response = await fetch(apiUrl(`/files/${fileId}`), { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Не удалось удалить файл");
  }
}
