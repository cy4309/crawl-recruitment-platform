export function obfuscateText(text) {
  return text
    .split("")
    .map((char, i) => (i % 2 === 0 ? "*" : char)) // ◼︎ or ⋆ or random unicode
    .join("");
}

export function recoverText(text, original) {
  return original; // 保留原始文字以便切換回來
}
