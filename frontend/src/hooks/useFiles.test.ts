import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFiles } from "./useFiles";

vi.mock("@/api/files", () => ({
  getFiles: vi.fn().mockResolvedValue([{ id: "1", title: "test" }]),
}));

describe("useFiles", () => {
  it("loads files on mount and flips isLoading off", async () => {
    const { result } = renderHook(() => useFiles());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.files).toEqual([{ id: "1", title: "test" }]);
    expect(result.current.errorMessage).toBeNull();
  });

  it("reload() can be called manually", async () => {
    const { result } = renderHook(() => useFiles());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.files).toEqual([{ id: "1", title: "test" }]);
  });
});
