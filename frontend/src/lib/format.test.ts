import { describe, expect, it } from "vitest";
import { formatSize, getLevelVariant, getProcessingVariant } from "./format";

describe("formatSize", () => {
  it("formats bytes", () => {
    expect(formatSize(500)).toBe("500 B");
  });

  it("formats kilobytes", () => {
    expect(formatSize(1536)).toBe("1.5 KB");
  });

  it("formats megabytes", () => {
    expect(formatSize(1024 * 1024 * 2)).toBe("2.0 MB");
  });
});

describe("getProcessingVariant", () => {
  it.each([
    ["failed", "danger"],
    ["processing", "warning"],
    ["processed", "success"],
    ["uploaded", "secondary"],
  ])("maps %s to %s", (status, expected) => {
    expect(getProcessingVariant(status)).toBe(expected);
  });
});

describe("getLevelVariant", () => {
  it.each([
    ["critical", "danger"],
    ["warning", "warning"],
    ["info", "success"],
  ])("maps %s to %s", (level, expected) => {
    expect(getLevelVariant(level)).toBe(expected);
  });
});
