import { qs } from "../utils/dom";

interface PageState {
  page: number;
  totalPages: number;
}

// Theo Figma: luôn có trang đầu, trang cuối và 3 trang quanh trang hiện tại
// VD (10 trang): trang 1 -> 1 2 3 … 10 | trang 5 -> 1 … 4 5 6 … 10 | trang 10 -> 1 … 8 9 10
// Khoảng trống chỉ thiếu 1 số thì hiện luôn số đó thay vì "…"
export function getPageItems(page: number, total: number): (number | "...")[] {
  const start = Math.max(1, Math.min(page - 1, total - 2));
  const end = Math.min(total, start + 2);
  const nums = [1, total];
  for (let n = start; n <= end; n++) nums.push(n);
  const sorted = [...new Set(nums)].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);

  const out: (number | "...")[] = [];
  sorted.forEach((n, i) => {
    const gap = i ? n - sorted[i - 1] : 1;
    if (gap === 2) out.push(n - 1);
    else if (gap > 2) out.push("...");
    out.push(n);
  });
  return out;
}

export function renderPagination(el: HTMLElement, { page, totalPages }: PageState, onChange: (p: number) => void): void {
  const btn = (label: string | number, target: number, ariaLabel: string, disabled = false, active = false) => `
    <li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
      <button type="button" class="page-link" data-page="${target}" aria-label="${ariaLabel}"
        ${disabled ? "disabled" : ""} ${active ? 'aria-current="page"' : ""}>${label}</button>
    </li>`;

  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  const pages = getPageItems(page, totalPages)
    .map((it) =>
      it === "..."
        ? `<li class="page-item disabled"><span class="page-link">…</span></li>`
        : btn(it, it, `Trang ${it}`, false, it === page)
    )
    .join("");

  const options = Array.from({ length: totalPages }, (_, i) =>
    `<option value="${i + 1}" ${i + 1 === page ? "selected" : ""}>${i + 1}</option>`
  ).join("");

  el.innerHTML = `
    <div class="d-flex align-items-center gap-2 small">
      Trang
      <select class="form-select form-select-sm w-auto js-page-select" aria-label="Chọn trang">${options}</select>
      Của ${totalPages}
    </div>
    <ul class="pagination pagination-sm mb-0">
      ${btn("«", 1, "Trang đầu", isFirst)}
      ${btn("‹", page - 1, "Trang trước", isFirst)}
      ${pages}
      ${btn("›", page + 1, "Trang sau", isLast)}
      ${btn("»", totalPages, "Trang cuối", isLast)}
    </ul>`;

  const go = (p: number) => {
    if (p >= 1 && p <= totalPages && p !== page) onChange(p);
  };
  el.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((b) =>
    b.addEventListener("click", () => go(Number(b.dataset.page)))
  );
  qs<HTMLSelectElement>(".js-page-select", el).addEventListener("change", (e) =>
    go(Number((e.target as HTMLSelectElement).value))
  );
}
