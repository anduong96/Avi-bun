import { describe, expect, test } from "bun:test";

import { isEmailAddress } from "./is.email.address";

describe("lib::isEmailAdress", () => {
  test("valid email address", () => {
    expect(isEmailAddress("example@email.com")).toBe(true);
    expect(isEmailAddress("user123@gmail.com")).toBe(true);
  });

  test("invalid email address", () => {
    expect(isEmailAddress("notanemail")).toBe(false);
    expect(isEmailAddress("invalid.email@")).toBe(false);
  });
});
