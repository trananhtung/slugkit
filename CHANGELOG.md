# Changelog

All notable changes to this project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-22

### Added

- `slug(input, options?)` — Unicode-aware slugify with NFKD accent folding, an
  explicit character map for letters normalization misses (`đ`, `ø`, `ß`, `æ`,
  `ł`, …), symbol words (`&` → `and`), custom separator, case preservation,
  custom `charMap`, and word-boundary `maxLength` truncation.
- `Slugger` / `createSlugger` — stateful generator that guarantees unique slugs
  by appending `-2`, `-3`, … with `has()` and `reset()`.
- `CHAR_MAP` exported for inspection/extension.
- ESM + CJS builds, types, and CI across Node 18 / 20 / 22.
