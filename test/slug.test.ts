import { describe, it, expect } from "vitest";
import { slug } from "../src/index.js";

describe("slug — basics", () => {
  it("lowercases and hyphenates words", () => {
    expect(slug("Hello, World!")).toBe("hello-world");
    expect(slug("  spaced   out  ")).toBe("spaced-out");
    expect(slug("Already-a-slug")).toBe("already-a-slug");
  });

  it("collapses runs of punctuation into a single separator", () => {
    expect(slug("a---b...c")).toBe("a-b-c");
    expect(slug("foo / bar \\ baz")).toBe("foo-bar-baz");
  });

  it("trims separators from both ends", () => {
    expect(slug("!!!wrapped!!!")).toBe("wrapped");
    expect(slug("-leading and trailing-")).toBe("leading-and-trailing");
  });

  it("keeps numbers", () => {
    expect(slug("Top 10 Tips")).toBe("top-10-tips");
    expect(slug("version 2.0.1")).toBe("version-2-0-1");
  });

  it("returns empty string for input with no slug-able characters", () => {
    expect(slug("!!!")).toBe("");
    expect(slug("")).toBe("");
  });
});

describe("slug — unicode folding", () => {
  it("folds Latin accents to ASCII", () => {
    expect(slug("Crème brûlée")).toBe("creme-brulee");
    expect(slug("naïve café")).toBe("naive-cafe");
    expect(slug("Müller Straße")).toBe("muller-strasse");
  });

  it("handles Vietnamese including đ", () => {
    expect(slug("Đặng Văn A")).toBe("dang-van-a");
    expect(slug("Tiếng Việt")).toBe("tieng-viet");
    expect(slug("phở bò")).toBe("pho-bo");
  });

  it("maps special Latin letters", () => {
    expect(slug("Øystein")).toBe("oystein");
    expect(slug("Łódź")).toBe("lodz");
    expect(slug("æther œuvre")).toBe("aether-oeuvre");
  });
});

describe("slug — symbols", () => {
  it("expands symbol words by default, each as its own word", () => {
    expect(slug("Bread & Butter")).toBe("bread-and-butter");
    expect(slug("A&B")).toBe("a-and-b");
    expect(slug("100% pure")).toBe("100-percent-pure");
    expect(slug("user@host")).toBe("user-at-host");
  });

  it("drops symbols when symbols:false", () => {
    expect(slug("Bread & Butter", { symbols: false })).toBe("bread-butter");
    expect(slug("100% pure", { symbols: false })).toBe("100-pure");
  });
});

describe("slug — options", () => {
  it("supports a custom separator", () => {
    expect(slug("Hello World", { separator: "_" })).toBe("hello_world");
    expect(slug("a b c", { separator: "." })).toBe("a.b.c");
  });

  it("can preserve case", () => {
    expect(slug("Hello World", { lower: false })).toBe("Hello-World");
  });

  it("truncates to maxLength without a trailing separator", () => {
    expect(slug("the quick brown fox", { maxLength: 13 })).toBe("the-quick");
    expect(slug("the quick brown fox", { maxLength: 9 })).toBe("the-quick");
  });

  it("accepts custom charMap overrides", () => {
    expect(slug("I ♥ JS", { charMap: { "♥": "love" } })).toBe("i-love-js");
  });
});
