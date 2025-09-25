// src/utils/slugify.ts
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ\s-]/g, "") // özel karakter temizleme
    .replace(/\s+/g, "-") // boşlukları - yap
    .replace(/-+/g, "-") // birden fazla - varsa teke indir
    .trim();
}
