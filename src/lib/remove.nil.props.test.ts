import { describe, expect, test } from "bun:test";

import { removeNilProp } from "./remove.nil.props";

describe("lib::remove.nil.prop", () => {
  test("should remove null and undefined values from an object", () => {
    const obj = {
      a: 1,
      b: null,
      c: undefined,
      d: "hello",
      e: {
        f: null,
        g: "world",
      },
    };

    const result = removeNilProp(obj);
    expect(result).toEqual({
      a: 1,
      d: "hello",
      e: {
        g: "world",
      },
    });
  });

  test("should return an empty object if input object is empty", () => {
    const obj = {};
    const result = removeNilProp(obj);
    expect(result).toEqual({});
  });

  test("should not modify the original object", () => {
    const obj = {
      a: 1,
      b: null,
    };

    removeNilProp(obj);
    expect(obj).toEqual({ a: 1, b: null });
  });
});
