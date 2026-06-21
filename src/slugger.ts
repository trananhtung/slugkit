import { slug, type SlugOptions } from "./slug.js";

/**
 * A stateful slug generator that guarantees **unique** output. Repeated inputs
 * get a numeric suffix (`-2`, `-3`, …) — ideal for headings, anchors, or any
 * set of slugs that must not collide.
 *
 * ```ts
 * const slugger = new Slugger();
 * slugger.slug("Hello");  // "hello"
 * slugger.slug("Hello");  // "hello-2"
 * slugger.slug("Hello");  // "hello-3"
 * ```
 */
export class Slugger {
  #seen = new Map<string, number>();
  #options: SlugOptions;

  constructor(options: SlugOptions = {}) {
    this.#options = options;
  }

  /** Slugify `input`, appending a counter when the base slug was already used. */
  slug(input: string, options?: SlugOptions): string {
    const separator = options?.separator ?? this.#options.separator ?? "-";
    const base = slug(input, { ...this.#options, ...options });

    const count = this.#seen.get(base);
    if (count === undefined) {
      this.#seen.set(base, 1);
      return base;
    }

    // Find the next free `${base}${separator}${n}`.
    let n = count + 1;
    let candidate = `${base}${separator}${n}`;
    while (this.#seen.has(candidate)) {
      n += 1;
      candidate = `${base}${separator}${n}`;
    }
    this.#seen.set(base, n);
    this.#seen.set(candidate, 1);
    return candidate;
  }

  /** Whether a fully-resolved slug has been produced already. */
  has(value: string): boolean {
    return this.#seen.has(value);
  }

  /** Forget all previously seen slugs. */
  reset(): void {
    this.#seen.clear();
  }
}

/** Convenience factory for {@link Slugger}. */
export function createSlugger(options?: SlugOptions): Slugger {
  return new Slugger(options);
}
