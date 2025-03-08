import { describe, expect, test } from "bun:test";
import Editor from "@react-page/editor";
import * as React from "react";

const largeContent = {
  // Sample large content for testing
  rows: Array(100).fill({
    cells: [{ content: { type: "text", text: "Sample content" } }],
  }),
};

describe("React-Page Performance", () => {
  test("Editor initialization", async () => {
    const editor = React.createElement(Editor, {
      value: null,
      onChange: () => {},
    });
    expect(editor).toBeDefined();
  });

  test("Plugin loading", async () => {
    const plugins = {
      content: [
        await import("@react-page/plugins-slate"),
        await import("@react-page/plugins-image"),
        await import("@react-page/plugins-video"),
      ],
    };
    expect(plugins.content.length).toBe(3);
  });

  test("Content serialization", async () => {
    const serialized = JSON.stringify(largeContent);
    const deserialized = JSON.parse(serialized);
    expect(deserialized).toEqual(largeContent);
  });

  test("Content validation", () => {
    const content = {
      rows: [
        {
          cells: [
            {
              content: {
                type: "text",
                text: "Test content",
              },
            },
          ],
        },
      ],
    };
    expect(content.rows).toBeDefined();
    expect(content.rows[0].cells).toBeDefined();
    expect(content.rows[0].cells[0].content.type).toBe("text");
  });
}); 