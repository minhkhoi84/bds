// "Vinhomes Ocean Park - Hà Nội" -> "vinhomes-ocean-park-ha-noi"
export function slugify(text = ""): string {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const projectDetailUrl = (id: string | number, slug: string): string =>
  `/project-detail.html?id=${encodeURIComponent(id)}&slug=${encodeURIComponent(slug)}`;

export const newsDetailUrl = (id: string | number): string =>
  `/news-detail.html?id=${encodeURIComponent(id)}`;