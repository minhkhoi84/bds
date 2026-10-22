import { escapeHtml as esc } from "../utils/format";

const LOGO = "/images/logo.svg";

// Ô nền xám nhạt + logo nhỏ ở giữa, dùng chung class kích thước của ảnh (project-card__img, ...)
export function noImage(cls: string, alt = "", logoSize = 28): string {
  return `<div class="${cls} bg-body-secondary d-flex align-items-center justify-content-center" role="img" aria-label="${esc(alt)}">
    <img src="${LOGO}" alt="" width="${logoSize}" height="${logoSize}" class="opacity-50" />
  </div>`;
}

// Ảnh thumbnail; không có link thì hiện ô thay thế (logoSize giữ lại trên data-logo-size cho lúc ảnh lỗi)
export function thumb(src: string, cls: string, alt: string, logoSize = 28): string {
  if (!src) return noImage(cls, alt, logoSize);
  return `<img class="${cls} js-thumb" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" data-logo-size="${logoSize}" />`;
}

// Ảnh tải lỗi -> thay bằng ô thay thế (sự kiện error không nổi bọt nên bắt ở capture)
export function bindThumbFallback(root: ParentNode = document): void {
  root.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !img.classList.contains("js-thumb")) return;
      const cls = [...img.classList].filter((c) => c !== "js-thumb").join(" ");
      img.outerHTML = noImage(cls, img.alt, Number(img.dataset.logoSize) || 28);
    },
    true
  );
}
