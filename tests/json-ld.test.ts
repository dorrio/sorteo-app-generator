import { test, expect } from '@playwright/test';
import { safeJsonLdStringify } from "@/lib/utils";

test.describe("safeJsonLdStringify", () => {
  test("escapes HTML characters <, >, and &", () => {
    const data = {
      name: "Me & You <script>",
      description: "A > B",
    };
    const json = safeJsonLdStringify(data);

    // Using explicit regex for the escaped unicode to be sure
    expect(json).toContain("\\u0026");
    expect(json).toContain("\\u003c");
    expect(json).toContain("\\u003e");

    // It should parse back to original object
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(data);
  });

  test("handles nested objects and arrays", () => {
    const data = {
      list: ["<item1>", "item2 & item3"],
      obj: { key: "Value > 10" }
    };
    const json = safeJsonLdStringify(data);

    expect(json).toContain("\\u003c");
    expect(json).toContain("\\u0026");
    expect(json).toContain("\\u003e");

    const parsed = JSON.parse(json);
    expect(parsed).toEqual(data);
  });
});
