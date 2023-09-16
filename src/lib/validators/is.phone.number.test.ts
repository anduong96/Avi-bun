import { describe, expect, test } from "bun:test";

import { isPhoneNumber } from "./is.phone.number";

describe("lib::isPhoneNumber", () => {
  test("valid phone number", () => {
    expect(isPhoneNumber("+14155552671")).toBe(true);
    expect(isPhoneNumber("+447911123456")).toBe(true);
    expect(isPhoneNumber("+5511987654321")).toBe(true);
  });

  test("invalid phone number", () => {
    expect(isPhoneNumber(undefined)).toBe(false);
    expect(isPhoneNumber("")).toBe(false);
    expect(isPhoneNumber("+1415")).toBe(false);
    expect(isPhoneNumber("14155552671")).toBe(false);
    expect(isPhoneNumber("+1415A552671")).toBe(false);
  });
});
