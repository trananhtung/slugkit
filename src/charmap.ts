/**
 * Characters that Unicode NFKD normalization does **not** decompose into an
 * ASCII base letter plus combining marks, so we map them explicitly. Most
 * accented letters (é, ñ, ü, …) are handled by normalization; this covers the
 * stubborn ones (đ, ø, ß, æ, ł, …) and a few useful symbol words.
 */
export const CHAR_MAP: Readonly<Record<string, string>> = {
  // Latin letters without a clean NFKD decomposition.
  đ: "d",
  Đ: "D",
  ð: "d",
  Ð: "D",
  ø: "o",
  Ø: "O",
  ł: "l",
  Ł: "L",
  ß: "ss",
  ẞ: "SS",
  æ: "ae",
  Æ: "AE",
  œ: "oe",
  Œ: "OE",
  þ: "th",
  Þ: "TH",
  ı: "i",
  ŉ: "n",
  // Common symbols people expect to read as words.
  "&": "and",
  "@": "at",
  "%": "percent",
  "₫": "dong",
  "€": "euro",
  $: "dollar",
  "£": "pound",
  "©": "c",
  "®": "r",
  "™": "tm",
};
