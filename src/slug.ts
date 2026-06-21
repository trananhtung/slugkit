import { CHAR_MAP } from "./charmap.js";

export interface SlugOptions {
  /** Word separator. Default `"-"`. */
  separator?: string;
  /** Lowercase the result. Default `true`. */
  lower?: boolean;
  /** Expand symbols like `&` → `and`, `%` → `percent`. Default `true`. */
  symbols?: boolean;
  /** Truncate to at most this many characters (never ends on a separator). */
  maxLength?: number;
  /** Extra replacements applied before slugifying (merged over the defaults). */
  charMap?: Record<string, string>;
}

const COMBINING_MARKS = /[̀-ͯ]/g;

/**
 * Convert arbitrary text into a clean, URL-safe slug.
 *
 * Folds Unicode accents (`café` → `cafe`, `Việt Nam` → `viet-nam`), maps
 * stubborn letters and symbols (`đ` → `d`, `&` → `and`), lowercases, and joins
 * words with a separator. Zero dependencies.
 *
 * ```ts
 * slug("Hello, World!");          // "hello-world"
 * slug("Crème brûlée & coffee");  // "creme-brulee-and-coffee"
 * slug("Đặng Văn A");             // "dang-van-a"
 * ```
 */
export function slug(input: string, options: SlugOptions = {}): string {
  const separator = options.separator ?? "-";
  const lower = options.lower ?? true;
  const symbols = options.symbols ?? true;
  const map = options.charMap ? { ...CHAR_MAP, ...options.charMap } : CHAR_MAP;

  let result = "";
  // Iterate by code point so multi-byte characters map correctly.
  for (const char of input.normalize("NFKC")) {
    if (!Object.prototype.hasOwnProperty.call(map, char)) {
      result += char;
      continue;
    }
    const replacement = map[char] as string;
    if (/^\p{L}/u.test(char)) {
      // Letter substitution (đ → d): glue it to its neighbours.
      result += replacement;
    } else if (symbols) {
      // Symbol word (& → and): pad so it becomes its own slug word.
      result += ` ${replacement} `;
    } else {
      result += " ";
    }
  }

  // Decompose remaining accents and strip the combining marks.
  result = result.normalize("NFKD").replace(COMBINING_MARKS, "");

  if (lower) result = result.toLowerCase();

  // Everything that is not a letter or number becomes a separator boundary.
  result = result
    .replace(/[^\p{L}\p{N}]+/gu, separator)
    .replace(new RegExp(`\\${separator}{2,}`, "g"), separator);

  // Trim separators from both ends.
  result = trimSeparator(result, separator);

  if (options.maxLength !== undefined && result.length > options.maxLength) {
    let cut = result.slice(0, options.maxLength);
    // If the cut landed mid-word, fall back to the last whole word.
    const nextChar = result.slice(options.maxLength, options.maxLength + separator.length);
    if (separator !== "" && nextChar !== separator) {
      const lastSep = cut.lastIndexOf(separator);
      if (lastSep > 0) cut = cut.slice(0, lastSep);
    }
    result = trimSeparator(cut, separator);
  }
  return result;
}

function trimSeparator(value: string, separator: string): string {
  if (separator === "") return value;
  let start = 0;
  let end = value.length;
  while (value.startsWith(separator, start)) start += separator.length;
  while (end >= start + separator.length && value.endsWith(separator, end)) {
    end -= separator.length;
  }
  return value.slice(start, end);
}
