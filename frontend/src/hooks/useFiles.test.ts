import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { deleteFile } from "@/api/files";
import { useFiles } from "./useFiles";

vi.mock("@/api/files", () => ({
  getFiles: vi.fn().mockResolvedValue([{ id: "1", title: "test" }]),
  deleteFile: vi.fn().mockResolvedValue(undefined),
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

  it("remove() deletes the file and reloads the list", async () => {
    const { result } = renderHook(() => useFiles());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.remove("1");
    });

    expect(deleteFile).toHaveBeenCalledWith("1");
    expect(result.current.deletingId).toBeNull();
    expect(result.current.errorMessage).toBeNull();
  });
});
