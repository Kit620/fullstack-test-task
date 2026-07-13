import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteFile, getFiles } from "./files";

describe("getFiles", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed files on success", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "1", title: "test" }],
    });
    vi.stubGlobal("fetch", mockFetch);

    const files = await getFiles();

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8000/files",
      expect.objectContaining({ cache: "no-store" }),
    );
    expect(files).toEqual([{ id: "1", title: "test" }]);
  });

  it("throws with the expected message when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }));

    await expect(getFiles()).rejects.toThrow("Не удалось загрузить данные");
  });
});

describe("deleteFile", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends a DELETE request to the file endpoint", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    await deleteFile("123");

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8000/files/123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("throws with the expected message when the response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await expect(deleteFile("123")).rejects.toThrow("Не удалось удалить файл");
  });
});
