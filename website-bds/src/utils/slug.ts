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

// /du-an/vinhomes-ocean-park-65 hoặc /du-an/vinhomes-ocean-park-65/vi-tri
export const projectDetailUrl = (id: string | number, slug: string, tab?: string): string =>
  `/du-an/${slug ? `${slug}-` : ""}${id}${tab ? `/${tab}` : ""}`;

// "vinhomes-ocean-park-65" -> 65; không có id ở cuối -> null
export function parseProjectId(slugId = ""): number | null {
  const m = slugId.match(/(?:^|-)(\d+)$/);
  return m ? Number(m[1]) : null;
}