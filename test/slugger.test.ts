import { describe, it, expect } from "vitest";
import { Slugger, createSlugger } from "../src/index.js";

describe("Slugger — uniqueness", () => {
  it("suffixes repeated slugs with an incrementing counter", () => {
    const s = new Slugger();
    expect(s.slug("Hello")).toBe("hello");
    expect(s.slug("Hello")).toBe("hello-2");
    expect(s.slug("Hello")).toBe("hello-3");
    expect(s.slug("World")).toBe("world");
  });

  it("treats inputs that slugify the same as duplicates", () => {
    const s = new Slugger();
    expect(s.slug("Hello World")).toBe("hello-world");
    expect(s.slug("hello, world")).toBe("hello-world-2");
  });

  it("avoids colliding with an explicit prior slug", () => {
    const s = new Slugger();
    expect(s.slug("post-2")).toBe("post-2");
    expect(s.slug("post")).toBe("post");
    expect(s.slug("post")).toBe("post-3"); // post-2 already taken, skip to -3
  });

  it("has() reports resolved slugs", () => {
    const s = new Slugger();
    s.slug("Hello");
    s.slug("Hello");
    expect(s.has("hello")).toBe(true);
    expect(s.has("hello-2")).toBe(true);
    expect(s.has("nope")).toBe(false);
  });

  it("reset() forgets history", () => {
    const s = new Slugger();
    s.slug("Hello");
    s.reset();
    expect(s.slug("Hello")).toBe("hello");
    expect(s.has("hello-2")).toBe(false);
  });
});

describe("Slugger — options", () => {
  it("inherits constructor options", () => {
    const s = new Slugger({ separator: "_" });
    expect(s.slug("Hello World")).toBe("hello_world");
    expect(s.slug("Hello World")).toBe("hello_world_2");
  });

  it("per-call options override constructor options", () => {
    const s = new Slugger({ separator: "-" });
    expect(s.slug("A B", { separator: "." })).toBe("a.b");
  });

  it("createSlugger is equivalent to new Slugger", () => {
    const s = createSlugger();
    expect(s.slug("X")).toBe("x");
    expect(s.slug("X")).toBe("x-2");
  });
});
