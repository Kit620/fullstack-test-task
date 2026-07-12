import { useCallback, useEffect, useState } from "react";
import { getAlerts } from "@/api/alerts";
import type { AlertItem } from "@/types/alert";

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setAlerts(await getAlerts());
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { alerts, isLoading, errorMessage, reload };
}
