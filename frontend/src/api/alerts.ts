import { apiUrl } from "./client";
import type { AlertItem } from "@/types/alert";

export async function getAlerts(): Promise<AlertItem[]> {
  const response = await fetch(apiUrl("/alerts"), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Не удалось загрузить данные");
  }
  return response.json();
}
