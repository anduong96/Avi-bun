import { describe, expect, it, test } from "bun:test";

import { isEmailAddress } from "./is.email.address";
import { isPhoneNumber } from "./is.phone.number";

describe("lib::isPhoneNumber", () => {
  test("valid phone number", () => {
    expect(isPhoneNumber("+14155552671")).toBe(true);
    expect(isPhoneNumber("+447911123456")).toBe(true);
    expect(isPhoneNumber("+5511987654321")).toBe(true);
  });

  test("invalid phone number", () => {
    expect(isEmailAddress("notanemail")).toBe(false);
    expect(isEmailAddress("invalid.email@")).toBe(false);
  });
});
