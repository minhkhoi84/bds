import './scss/main.scss';
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import axios from 'axios';
import { projectApi } from './api/projectApi';
import { newsApi } from './api/newsApi';
import { investorApi } from './api/investorApi';
import { masterDataApi } from './api/masterDataApi';
import { renderProjectCard, renderHotProjectItem } from './components/projectCard';
import { renderPagination } from './components/pagination';
import { newsCard } from './components/newsCard';
import { bindThumbFallback } from './components/thumb';
import { GROUP_CODE, PAGE_SIZE } from './utils/constants';
import { escapeHtml as esc } from './utils/format';
import { projectDetailUrl } from './utils/slug';
import { showToast } from './utils/toast';

interface Filters {
  name: string;
  investorId: string;
  regionCode: string;
  typeCode: string;
  statusCode: string;
}

const listEl = document.querySelector<HTMLElement>('#project-list-container');
const paginationEl = document.querySelector<HTMLElement>('#project-pagination');
const hotEl = document.querySelector<HTMLElement>('#hot-projects-container');
const newsEl = document.querySelector<HTMLElement>('#news-list-container');
const searchForm = document.querySelector<HTMLFormElement>('.hero-search-box');

const filters: Filters = { name: '', investorId: '', regionCode: '', typeCode: '', statusCode: '' };
let page = 1;
let listController: AbortController | undefined;

/* ---------- Trạng thái tải / lỗi / rỗng ---------- */
const repeat = (n: number, html: string) => html.repeat(n);

const projectSkeleton = repeat(PAGE_SIZE, `
  <div class="col-12 col-md-6 col-lg-4" aria-hidden="true">
    <div class="project-card placeholder-glow">
      <div class="project-card__thumb"><span class="placeholder w-100 h-100"></span></div>
      <div class="project-card__body">
        <div class="project-card__content">
          <span class="placeholder col-9"></span>
          <span class="placeholder col-6"></span>
          <span class="placeholder col-12"></span>
        </div>
      </div>
    </div>
  </div>`);

const hotSkeleton = repeat(4, `
  <div class="hot-item placeholder-glow" aria-hidden="true">
    <span class="placeholder hot-item__img"></span>
    <div class="hot-item__info flex-grow-1">
      <span class="placeholder col-10"></span>
      <span class="placeholder col-6"></span>
    </div>
  </div>`);

const newsSkeleton = repeat(4, `
  <div class="col-12 col-sm-6 col-lg-3" aria-hidden="true">
    <div class="news-card placeholder-glow">
      <span class="placeholder news-card__img"></span>
      <div class="news-card__body">
        <span class="placeholder col-12"></span>
        <span class="placeholder col-8"></span>
      </div>
    </div>
  </div>`);

const emptyState = (text: string) =>
  `<div class="col-12 text-center text-muted py-5">${esc(text)}</div>`;

const errorState = (text: string) => `
  <div class="col-12 text-center py-4">
    <p class="text-danger small mb-2">${esc(text)}</p>
    <button type="button" class="btn btn-outline-primary btn-sm js-retry">Thử lại</button>
  </div>`;

// Gắn nút "Thử lại" 1 lần cho mỗi vùng
function bindRetry(el: HTMLElement | null, reload: () => void): void {
  el?.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.js-retry')) reload();
  });
}

/* ---------- Danh sách dự án + phân trang phía server ---------- */
async function loadProjects(): Promise<void> {
  if (!listEl) return;
  // Hủy request cũ để response cũ không ghi đè response mới
  listController?.abort();
  const controller = new AbortController();
  listController = controller;

  listEl.innerHTML = projectSkeleton;
  try {
    const { items, totalPages } = await projectApi.search({ page, ...filters }, { signal: controller.signal });
    if (controller.signal.aborted) return;

    if (!items.length) {
      // Trang vượt quá số trang (backend trả totalElements = 0) -> về trang 1 rồi gọi lại
      if (page > 1) {
        page = 1;
        return loadProjects();
      }
      listEl.innerHTML = emptyState('Không tìm thấy dự án nào');
      togglePagination(false);
      return;
    }

    listEl.innerHTML = items.map(renderProjectCard).join('');
    if (paginationEl) {
      renderPagination(paginationEl, { page, totalPages }, goToPage);
      togglePagination(true);
    }
  } catch (err) {
    if (axios.isCancel(err) || controller.signal.aborted) return;
    console.error(err);
    listEl.innerHTML = errorState('Không tải được danh sách dự án.');
    togglePagination(false);
  }
}

function togglePagination(show: boolean): void {
  paginationEl?.classList.toggle('d-none', !show);
}

function goToPage(p: number): void {
  page = p;
  // Cuộn lên đầu danh sách dự án
  document.querySelector('.project-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  loadProjects();
}

/* ---------- Bộ lọc trong .hero-search-box ---------- */
// Thứ tự 4 dropdown trong index.html: chủ đầu tư, khu vực, loại hình, trạng thái
const selects = searchForm ? [...searchForm.querySelectorAll<HTMLSelectElement>('.search-field select')] : [];
const [investorSelect, regionSelect, typeSelect, statusSelect] = selects;
const keywordInput = searchForm?.querySelector<HTMLInputElement>('.search-field-name input');

// Xóa option cứng, giữ option đầu "Tất cả ..." với value ""
function fillSelect(select: HTMLSelectElement | undefined, list: Option[]): void {
  if (!select) return;
  const allLabel = select.options[0]?.textContent?.trim() ?? 'Tất cả';
  select.innerHTML =
    `<option value="" selected>${esc(allLabel)}</option>` +
    list.map((i) => `<option value="${esc(i.value)}">${esc(i.label)}</option>`).join('');
}

type Option = { value: string | number; label: string };
interface FilterSource {
  select: HTMLSelectElement | undefined;
  load: () => Promise<Option[]>;
}

const masterOptions = async (group: Parameters<typeof masterDataApi.getByGroup>[0]): Promise<Option[]> =>
  (await masterDataApi.getByGroup(group)).map((i) => ({ value: i.code, label: i.value }));

const filterSources: FilterSource[] = [
  { select: investorSelect, load: async () => (await investorApi.getList()).map((i) => ({ value: i.id, label: i.name })) },
  { select: regionSelect, load: () => masterOptions(GROUP_CODE.REGION) },
  { select: typeSelect, load: () => masterOptions(GROUP_CODE.TYPE) },
  { select: statusSelect, load: () => masterOptions(GROUP_CODE.STATUS) },
];
const loadingFilters = new Set<FilterSource>();

// Chỉ tải các bộ lọc được truyền vào; lỗi thì dropdown vẫn dùng được với option "Tất cả"
// và toast có nút "Thử lại" chỉ gọi lại đúng các bộ lọc bị lỗi
async function loadFilters(sources: FilterSource[]): Promise<void> {
  const todo = sources.filter((s) => !loadingFilters.has(s));
  const failed: FilterSource[] = [];
  // Bộ lọc nào về trước thì đổ ngay, không chờ bộ lọc chậm
  await Promise.all(
    todo.map(async (s) => {
      loadingFilters.add(s);
      try {
        fillSelect(s.select, await s.load());
      } catch (err) {
        console.error(err);
        failed.push(s);
      } finally {
        loadingFilters.delete(s);
      }
    })
  );
  if (failed.length) {
    showToast('Không tải được dữ liệu bộ lọc', { label: 'Thử lại', onClick: () => loadFilters(failed) });
  }
}

function initFilters(): void {
  if (selects.length !== 4) console.error('Không tìm đủ 4 dropdown lọc trong .hero-search-box');
  // Bỏ option cứng ngay, tránh gửi giá trị giả lên API khi dữ liệu thật chưa về
  selects.forEach((s) => fillSelect(s, []));
  loadFilters(filterSources);
}

// Lấy từ khóa đang hiện trong ô tìm kiếm + 4 dropdown; force = true thì gọi lại kể cả khi không đổi
function applyFilters(force = false): void {
  const next: Filters = {
    name: keywordInput?.value.trim() ?? '',
    investorId: investorSelect?.value ?? '',
    regionCode: regionSelect?.value ?? '',
    typeCode: typeSelect?.value ?? '',
    statusCode: statusSelect?.value ?? '',
  };
  if (!force && JSON.stringify(next) === JSON.stringify(filters)) return; // không đổi thì khỏi gọi lại
  Object.assign(filters, next);
  page = 1; // đổi bộ lọc / từ khóa -> về trang 1
  loadProjects();
}

function bindFilters(): void {
  // Ô tìm kiếm chỉ chạy khi nhấn Enter (gõ phím không gọi API); không reload trang
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters(true);
  });
  // Đổi dropdown: áp dụng ngay, kèm từ khóa đang hiện trong ô tìm kiếm
  selects.forEach((s) => s.addEventListener('change', () => applyFilters()));

  // Mobile: nút phễu bật/tắt 4 dropdown (desktop luôn hiện, nút bị ẩn)
  const filterToggle = searchForm?.querySelector<HTMLButtonElement>('.hero-filter-btn');
  filterToggle?.addEventListener('click', () => {
    const open = searchForm!.classList.toggle('is-filter-open');
    filterToggle.setAttribute('aria-expanded', String(open));
    filterToggle.setAttribute('aria-label', open ? 'Đóng bộ lọc' : 'Bộ lọc');
  });
}

/* ---------- Nút "Chia sẻ": sao chép link dự án, không chuyển trang ---------- */
function bindShareButtons(): void {
  listEl?.addEventListener('click', async (event) => {
    const shareButton = (event.target as HTMLElement).closest('.js-share');
    if (!shareButton) return;
    const card = shareButton.closest<HTMLElement>('[data-id]');
    const url = location.origin + projectDetailUrl(card?.dataset.id ?? '', card?.dataset.slug ?? '');
    try {
      await navigator.clipboard.writeText(url);
      showToast('Đã sao chép liên kết dự án');
    } catch {
      showToast('Không thể sao chép liên kết');
    }
  });
}

/* ---------- Dự án HOT ---------- */
let hotReqId = 0;
async function loadHot(): Promise<void> {
  if (!hotEl) return;
  const id = ++hotReqId;
  hotEl.innerHTML = hotSkeleton;
  try {
    const { items } = await projectApi.searchHot();
    if (id !== hotReqId) return;
    hotEl.innerHTML = items.length
      ? items.map(renderHotProjectItem).join('')
      : `<p class="text-muted small mb-0">Chưa có dự án HOT</p>`;
  } catch (err) {
    if (id !== hotReqId) return;
    console.error(err);
    hotEl.innerHTML = errorState('Không tải được dự án HOT.');
  }
}

/* ---------- Tin tức: 4 bài mới nhất ---------- */
let newsReqId = 0;
async function loadNews(): Promise<void> {
  if (!newsEl) return;
  const id = ++newsReqId;
  newsEl.innerHTML = newsSkeleton;
  try {
    const { items } = await newsApi.search({ pageSize: 4 });
    if (id !== newsReqId) return;
    newsEl.innerHTML = items.length ? items.map(newsCard).join('') : emptyState('Chưa có tin tức');
  } catch (err) {
    if (id !== newsReqId) return;
    console.error(err);
    newsEl.innerHTML = errorState('Không tải được tin tức.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  bindThumbFallback();
  bindShareButtons();
  bindFilters();
  bindRetry(listEl, loadProjects);
  bindRetry(hotEl, loadHot);
  bindRetry(newsEl, loadNews);

  initFilters();
  loadProjects();
  loadHot();
  loadNews();
});
