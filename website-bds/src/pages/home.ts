import "../main";
import { projectApi } from "../api/projectApi";
import { investorApi } from "../api/investorApi";
import { masterDataApi } from "../api/masterDataApi";
import { newsApi } from "../api/newsApi";
import { projectCard } from "../components/projectCard";
import { hotProjectItem } from "../components/hotProjectItem";
import { newsCard } from "../components/newsCard";
import { renderPagination } from "../components/pagination";
import { GROUP_CODE } from "../utils/constants";
import { qs } from "../utils/dom";
import { escapeHtml as esc } from "../utils/format";
import { projectDetailUrl } from "../utils/slug";
import { showToast } from "../utils/toast";

interface Filters {
  name: string;
  investorId: string;
  regionCode: string;
  typeCode: string;
  statusCode: string;
}

const form = qs<HTMLFormElement>("#search-form");
const projectListEl = qs("#project-list");
const paginationEl = qs("#pagination");

const filters: Filters = { name: "", investorId: "", regionCode: "", typeCode: "", statusCode: "" };
let page = 1;
let reqId = 0; // tránh response cũ ghi đè response mới khi lọc nhanh

const spinner = `<div class="col-12 text-center py-5"><div class="spinner-border text-primary"></div></div>`;
const message = (text: string, cls = "text-muted") =>
  `<div class="col-12 text-center ${cls} py-5">${text}</div>`;

/* ---------- Danh sách dự án + phân trang ---------- */
async function loadProjects(): Promise<void> {
  const id = ++reqId;
  projectListEl.innerHTML = spinner;
  try {
    const { items, totalPages } = await projectApi.search({ page, ...filters });
    if (id !== reqId) return;
    if (!items.length) {
      projectListEl.innerHTML = message("Không tìm thấy dự án phù hợp");
      paginationEl.innerHTML = "";
      return;
    }
    projectListEl.innerHTML = items.map(projectCard).join("");
    renderPagination(paginationEl, { page, totalPages }, goToPage);
  } catch (err) {
    console.error(err);
    if (id === reqId) projectListEl.innerHTML = message("Không tải được dữ liệu, vui lòng thử lại", "text-danger");
  }
}

function goToPage(p: number): void {
  page = p;
  window.scrollTo({ top: 0, behavior: "smooth" }); // chuyển trang -> focus lên đầu trang
  loadProjects();
}

/* ---------- Bộ lọc ---------- */
function fillSelect<T>(select: HTMLSelectElement, list: T[], valueKey: keyof T, labelKey: keyof T): void {
  select.insertAdjacentHTML(
    "beforeend",
    list.map((i) => `<option value="${esc(i[valueKey])}">${esc(i[labelKey])}</option>`).join("")
  );
}

async function initFilters(): Promise<void> {
  try {
    const [investors, regions, types, statuses] = await Promise.all([
      investorApi.getList(),
      masterDataApi.getByGroup(GROUP_CODE.REGION),
      masterDataApi.getByGroup(GROUP_CODE.TYPE),
      masterDataApi.getByGroup(GROUP_CODE.STATUS),
    ]);
    fillSelect(qs<HTMLSelectElement>('[name="investor"]', form), investors, "id", "name");
    fillSelect(qs<HTMLSelectElement>('[name="region"]', form), regions, "code", "value");
    fillSelect(qs<HTMLSelectElement>('[name="type"]', form), types, "code", "value");
    fillSelect(qs<HTMLSelectElement>('[name="status"]', form), statuses, "code", "value");
  } catch (err) {
    console.error("Không tải được dữ liệu bộ lọc", err);
  }
}

function applyFilters(): void {
  const f = new FormData(form);
  const get = (key: string) => String(f.get(key) ?? "");
  const next: Filters = {
    name: get("keyword").trim(),
    investorId: get("investor"),
    regionCode: get("region"),
    typeCode: get("type"),
    statusCode: get("status"),
  };
  if (JSON.stringify(next) === JSON.stringify(filters)) return; // không đổi thì khỏi gọi lại
  Object.assign(filters, next);
  page = 1; // đổi bộ lọc -> về trang 1
  loadProjects();
}

function debounce<A extends unknown[]>(fn: (...args: A) => void, ms = 400) {
  let t: number | undefined;
  return (...args: A) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

form.addEventListener("submit", (e) => { e.preventDefault(); applyFilters(); });
form.addEventListener("change", applyFilters);
qs<HTMLInputElement>('[name="keyword"]', form).addEventListener("input", debounce(applyFilters));

/* ---------- Click card: chuyển trang / chia sẻ ---------- */
async function handleProjectClick(e: Event): Promise<void> {
  const target = e.target as HTMLElement;
  const item = target.closest<HTMLElement>("[data-id]");
  if (!item) return;
  const url = projectDetailUrl(item.dataset.id ?? "", item.dataset.slug ?? "");

  if (target.closest(".js-share")) {
    try {
      await navigator.clipboard.writeText(location.origin + url);
      showToast("Đã sao chép liên kết dự án");
    } catch {
      showToast("Không thể sao chép liên kết");
    }
    return; // không chuyển trang
  }
  window.location.href = url; // trang chi tiết mặc định mở tab "Tổng quan"
}
projectListEl.addEventListener("click", handleProjectClick);
qs("#hot-list").addEventListener("click", handleProjectClick);

/* ---------- Dự án HOT ---------- */
async function loadHot(): Promise<void> {
  try {
    // pageSize lớn để lấy "toàn bộ"; nếu backend giới hạn pageSize thì phải lặp qua các trang
    const { items } = await projectApi.search({ pageSize: 100, isHot: true });
    qs("#hot-list").innerHTML = items.map(hotProjectItem).join("");
  } catch (err) {
    console.error(err);
  }
}

/* ---------- Tin tức (4 bài mới nhất) ---------- */
async function loadNews(): Promise<void> {
  try {
    const { items } = await newsApi.search();
    qs("#news-list").innerHTML = items.map(newsCard).join("");
  } catch (err) {
    console.error(err);
  }
}

initFilters();
loadProjects();
loadHot();
loadNews();