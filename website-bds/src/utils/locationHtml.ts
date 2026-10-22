import DOMPurify from "dompurify";
import type { Content } from "../types/content";

const isImageSrc = (src: string) => /^(https?:\/\/|data:image\/)/i.test(src);

// Lấy src hợp lệ của <img> đầu tiên còn lại rồi gỡ nó khỏi HTML
function takeImage(body: HTMLElement): string | null {
  const img = Array.from(body.querySelectorAll("img")).find((i) => isImageSrc(i.getAttribute("src") ?? ""));
  if (!img) return null;
  img.remove();
  return img.getAttribute("src");
}

// embedLocation là chuỗi "<iframe src=...>" do admin dán vào -> không chèn nguyên HTML,
// chỉ lấy src và chỉ chấp nhận Google Maps (maps/embed, My Maps maps/d/embed); sai -> null
export function mapEmbedSrc(embed: string | null | undefined): string | null {
  if (!embed?.trim()) return null;
  const raw = embed.trim().startsWith("<")
    ? new DOMParser().parseFromString(embed, "text/html").querySelector("iframe")?.getAttribute("src")
    : embed.trim(); // admin dán thẳng link
  try {
    const url = new URL(raw ?? "");
    const isGoogle = url.hostname === "www.google.com" || url.hostname === "google.com" || url.hostname === "maps.google.com";
    return url.protocol === "https:" && isGoogle && url.pathname.startsWith("/maps") ? url.href : null;
  } catch {
    return null;
  }
}

// Tab Vị trí: API không có trường riêng cho từng khối, nên tách từ nội dung trình soạn thảo:
// - mapSrc   : <img> đầu tiên trong content (ảnh bản đồ lớn)
// - sideSrc  : ảnh cột phải (ảnh vệ tinh) = ảnh đính kèm đầu tiên KHÔNG nằm trong content,
//              không có thì <img> thứ hai trong content
// - bodyHtml : phần còn lại (danh sách, mô tả), đã lọc bằng DOMPurify
// Lưu ý: ảnh chèn qua trình soạn thảo cũng được backend đưa vào fileInfoList (trùng với <img> trong content)
export function splitLocationContent(data: Content | null) {
  // Lọc trước (bỏ script, on*, javascript:...), sau đó mới tách
  const body = DOMPurify.sanitize(data?.content ?? "", { RETURN_DOM: true }) as HTMLElement; // RETURN_DOM -> <body>
  const inlineSrcs = new Set(Array.from(body.querySelectorAll("img"), (i) => i.getAttribute("src")));

  const mapSrc = takeImage(body);
  const attached = data?.fileInfoList?.find(
    (f) => f.contentType?.startsWith("image/") && isImageSrc(f.fullLink ?? "") && !inlineSrcs.has(f.fullLink),
  );
  const sideSrc = attached?.fullLink ?? takeImage(body);

  // Bỏ <img> mất src (DOMPurify gỡ src không an toàn) và đoạn rỗng (<p>&nbsp;</p>, <p> còn lại sau khi tách ảnh)
  body.querySelectorAll("img").forEach((i) => {
    if (!isImageSrc(i.getAttribute("src") ?? "")) i.remove();
  });
  body.querySelectorAll("p").forEach((p) => {
    if (!p.textContent?.trim() && !p.querySelector("img, iframe, video")) p.remove();
  });

  return { mapSrc, sideSrc, bodyHtml: body.innerHTML.trim() };
}
