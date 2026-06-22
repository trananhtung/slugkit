# slugkit

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

> Tiny, type-safe **slugify** — Unicode accent folding, symbol words, and a **unique-slug** generator. **Zero dependencies**.

[![CI](https://github.com/trananhtung/slugkit/actions/workflows/ci.yml/badge.svg)](https://github.com/trananhtung/slugkit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/slugkit.svg)](https://www.npmjs.com/package/slugkit)
[![bundle size](https://img.shields.io/bundlephobia/minzip/slugkit)](https://bundlephobia.com/package/slugkit)
[![types](https://img.shields.io/npm/types/slugkit.svg)](https://www.npmjs.com/package/slugkit)
[![license](https://img.shields.io/npm/l/slugkit.svg)](./LICENSE)

Turning a title into a clean URL sounds trivial until the title is `Crème brûlée
& coffee` or `Đặng Văn A`, or until two headings slugify to the same anchor.
`slugkit` folds accents to ASCII, turns symbols into words, and — when you need
it — guarantees every slug in a document is unique. **Zero dependencies**, Node
and browser.

```ts
import { slug } from "slugkit";

slug("Hello, World!");          // "hello-world"
slug("Crème brûlée & coffee");  // "creme-brulee-and-coffee"
slug("Đặng Văn A");             // "dang-van-a"
```

## Why slugkit?

- **Real Unicode folding.** Accents are normalized away (`café` → `cafe`), and the
  letters normalization misses (`đ`, `ø`, `ß`, `æ`, `ł`, …) are mapped explicitly.
- **Symbol words.** `&` → `and`, `%` → `percent`, `@` → `at` — opt out with
  `symbols: false`.
- **Unique slugs.** The `Slugger` appends `-2`, `-3`, … so a page full of repeated
  headings still gets collision-free anchors.
- **Configurable.** Custom separator, preserve case, `maxLength` that truncates on
  a **word boundary**, and your own character overrides.
- **Typed & tiny.** Full types, ESM + CJS, zero dependencies.

## Install

```bash
npm install slugkit
# or: pnpm add slugkit  /  yarn add slugkit  /  bun add slugkit
```

## `slug(input, options?)`

```ts
import { slug } from "slugkit";

slug("Top 10 Tips");                          // "top-10-tips"
slug("Müller Straße");                        // "muller-strasse"
slug("Hello World", { separator: "_" });      // "hello_world"
slug("Hello World", { lower: false });        // "Hello-World"
slug("Bread & Butter", { symbols: false });   // "bread-butter"
slug("the quick brown fox", { maxLength: 13 }); // "the-quick" (no half-words)
slug("I ♥ JS", { charMap: { "♥": "love" } });   // "i-love-js"
```

```ts
interface SlugOptions {
  separator?: string;   // default "-"
  lower?: boolean;      // default true
  symbols?: boolean;    // default true (& → and, % → percent, …)
  maxLength?: number;   // truncate on a word boundary
  charMap?: Record<string, string>; // extra replacements
}
```

## Unique slugs with `Slugger`

```ts
import { Slugger } from "slugkit";

const slugger = new Slugger();
slugger.slug("Introduction"); // "introduction"
slugger.slug("Introduction"); // "introduction-2"
slugger.slug("Introduction"); // "introduction-3"

slugger.has("introduction-2"); // true
slugger.reset();               // start over
```

`new Slugger(options)` applies those `SlugOptions` to every call (overridable
per call). `createSlugger(options?)` is a factory shorthand. Perfect for building
a table of contents:

```ts
const slugger = new Slugger();
const anchors = headings.map((h) => ({ text: h, id: slugger.slug(h) }));
```

## Notes

- Iterates by code point, so multi-byte characters and emoji are handled safely.
- Anything that isn't a letter or number becomes a separator boundary; runs are
  collapsed and the ends are trimmed.

## Pairs well with

| Need | Use |
| --- | --- |
| Generate a unique id (not derived from text) | [`idkit`](https://www.npmjs.com/package/idkit) |
| Redact secrets/PII from text | [`scrubtext`](https://www.npmjs.com/package/scrubtext) |

## Contributors ✨

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome — code, docs, bug reports, ideas, reviews! See the [emoji key](https://allcontributors.org/docs/en/emoji-key) for how each contribution is recognized, and open a PR or issue to get involved.

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/trananhtung"><img src="https://avatars.githubusercontent.com/u/30992229?v=4?s=100" width="100px;" alt="Tung Tran"/><br /><sub><b>Tung Tran</b></sub></a><br /><a href="https://github.com/trananhtung/slugkit/commits?author=trananhtung" title="Code">💻</a> <a href="#maintenance-trananhtung" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[MIT](./LICENSE) © Tung Tran
