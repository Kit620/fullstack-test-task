import { afterEach, describe, expect, it, vi } from "vitest";
import { getFiles } from "./files";

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
