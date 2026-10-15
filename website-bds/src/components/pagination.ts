import { qs } from "../utils/dom";

interface PageState {
  page: number;
  totalPages: number;
}

// Luôn hiện 3 trang đầu, trang cuối và các trang kề trang hiện tại
// VD: trang 1 -> 1 2 3 ... 20 | trang 10 -> 1 2 3 ... 9 10 11 ... 20
function getPageItems(page: number, total: number): (number | "...")[] {
  const nums = [...new Set([1, 2, 3, total, page - 1, page, page + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: (number | "...")[] = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push("...");
    out.push(n);
  });
  return out;
}

export function renderPagination(el: HTMLElement, { page, totalPages }: PageState, onChange: (p: number) => void): void {
  const btn = (label: string | number, target: number, disabled = false, active = false) => `
    <li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
      <button class="page-link" data-page="${target}">${label}</button>
    </li>`;

  const pages = getPageItems(page, totalPages)
    .map((it) =>
      it === "..."
        ? `<li class="page-item disabled"><span class="page-link">...</span></li>`
        : btn(it, it, false, it === page)
    )
    .join("");

  const options = Array.from({ length: totalPages }, (_, i) =>
    `<option value="${i + 1}" ${i + 1 === page ? "selected" : ""}>${i + 1}</option>`
  ).join("");

  el.innerHTML = `
    <div class="d-flex align-items-center gap-2 small">
      Trang
      <select class="form-select form-select-sm w-auto js-page-select">${options}</select>
      Của ${totalPages}
    </div>
    <ul class="pagination pagination-sm mb-0">
      ${btn("«", 1, page === 1)}
      ${btn("‹", page - 1, page === 1)}
      ${pages}
      ${btn("›", page + 1, page === totalPages)}
      ${btn("»", totalPages, page === totalPages)}
    </ul>`;

  el.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((b) =>
    b.addEventListener("click", () => onChange(Number(b.dataset.page)))
  );
  qs<HTMLSelectElement>(".js-page-select", el).addEventListener("change", (e) =>
    onChange(Number((e.target as HTMLSelectElement).value))
  );
}