import "../scss/main.scss";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import axios from "axios";
import { projectApi } from "../api/projectApi";
import { ApiError } from "../api/helpers";
import { contentApi } from "../api/contentApi";
import { bindThumbFallback, thumb } from "../components/thumb";
import type { Content } from "../types/content";
import type { ProjectDetail } from "../types/project";
import { escapeHtml as esc } from "../utils/format";
import { initMobileMenu } from "../utils/mobileMenu";
import { projectDetailUrl, slugify } from "../utils/slug";
import { mapEmbedSrc, splitLocationContent } from "../utils/locationHtml";
import { showToast } from "../utils/toast";

// project-detail.html?id=65&slug=vinhomes-ocean-park-2-3&tab=vi-tri
const PROJECT_TABS = [
  { slug: "tong-quan", label: "Tổng quan", icon: "bi-arrows-move" },
  { slug: "vi-tri", label: "Vị trí", icon: "bi-geo-alt" },
  { slug: "phan-khu", label: "Phân khu", icon: "bi-compass" },
  { slug: "mat-bang-quy-can", label: "Mặt bằng quỹ căn", icon: "bi-map" },
  { slug: "quy-can", label: "Quỹ căn", icon: "bi-buildings" },
  { slug: "chinh-sach-ban-hang", label: "Chính sách bán hàng", icon: "bi-file-earmark-text" },
  { slug: "tin-tuc", label: "Tin tức", icon: "bi-globe" },
] as const;

type TabSlug = (typeof PROJECT_TABS)[number]["slug"];
const DEFAULT_TAB: TabSlug = "tong-quan";
const isTabSlug = (s: string | null): s is TabSlug => PROJECT_TABS.some((t) => t.slug === s);

const root = document.querySelector<HTMLElement>("#project-detail");

/* ---------- Đọc URL ---------- */
// id không phải số nguyên dương -> null (không gọi API: backend trả 500 với id chữ)
function readProjectId(): number | null {
  const raw = new URLSearchParams(location.search).get("id") ?? "";
  return /^\d+$/.test(raw) ? Number(raw) : null;
}

function readTab(): TabSlug {
  const tab = new URLSearchParams(location.search).get("tab");
  return isTabSlug(tab) ? tab : DEFAULT_TAB;
}

// Sai slug (VD dự án đổi tên) hoặc thiếu/sai tab -> sửa URL tại chỗ, không thêm lịch sử
function fixUrl(project: ProjectDetail, tab: TabSlug): string {
  const canonical = projectDetailUrl(project.id, slugify(project.name), tab);
  if (location.pathname + location.search !== canonical) history.replaceState(null, "", canonical);
  return canonical;
}

/* ---------- Trạng thái ---------- */
const stateBox = (inner: string) => `<div class="container main-content-container py-5 text-center">${inner}</div>`;

const loadingState = () =>
  stateBox(`<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Đang tải...</span></div>`);

const messageState = (text: string) => stateBox(`<p class="text-muted mb-0">${esc(text)}</p>`);

const errorState = () =>
  stateBox(`<p class="text-danger mb-2">Không tải được dữ liệu dự án.</p>
    <button type="button" class="btn btn-outline-primary btn-sm js-retry">Thử lại</button>`);

const isNotFound = (err: unknown) =>
  (axios.isAxiosError(err) && err.response?.status === 404) ||
  (err instanceof ApiError && err.code === "RESOURCE_NOT_FOUND");

/* ---------- Phần đầu trang (Figma "Chi tiết dự án") ---------- */
function renderPage(project: ProjectDetail, tab: TabSlug): string {
  const name = esc(project.name);
  return `
    <div class="container main-content-container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb project-breadcrumb">
          <li class="breadcrumb-item"><a href="/">Dự án</a></li>
          <li class="breadcrumb-item active" aria-current="page">${name}</li>
        </ol>
      </nav>

      <div class="project-detail__body">
        <div class="project-head">
          <div class="project-head__text">
            <h1 class="project-head__title">${name}</h1>
            <p class="project-head__desc">Theo dõi thông tin chi tiết và bảng giá, mặt bằng, tiến độ và chính sách bán hàng dự án ${name}.</p>
          </div>
          <button type="button" class="project-share-btn js-share">
            <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i> Chia sẻ
          </button>
        </div>

        <!-- API chi tiết chỉ trả 1 ảnh (fileInfo) -> không làm slider -->
        ${thumb(project.thumbnail, "project-banner", project.name, 64)}

        ${renderTabs(project, tab)}
        <div id="project-tab-content"></div>
      </div>
    </div>`;
}

/* ---------- Thanh tab ---------- */
// Mỗi tab là link thật (mở tab mới / chuột giữa vẫn chạy); click thường -> pushState, không tải lại trang
function renderTabs(project: ProjectDetail, active: TabSlug): string {
  const slug = slugify(project.name);
  return `
    <nav class="project-tabs" id="project-tabs" aria-label="Thông tin dự án">
      ${PROJECT_TABS.map(
        (t) => `
        <a class="project-tab${t.slug === active ? " active" : ""}" data-tab="${t.slug}"
           href="${esc(projectDetailUrl(project.id, slug, t.slug))}"${t.slug === active ? ' aria-current="page"' : ""}>
          <i class="bi ${t.icon}" aria-hidden="true"></i>${esc(t.label)}
        </a>`
      ).join("")}
    </nav>`;
}

// Chỉ cuộn ngang thanh tab cho tab đang chọn vào giữa (scrollIntoView sẽ kéo cả trang)
function centerActiveTab(): void {
  const bar = document.querySelector<HTMLElement>("#project-tabs");
  const el = bar?.querySelector<HTMLElement>(".project-tab.active");
  if (bar && el) bar.scrollLeft = el.offsetLeft - (bar.clientWidth - el.offsetWidth) / 2;
}

// Nội dung từng tab: mới làm "Vị trí", tab khác -> khung chờ
function renderTabContent(tab: TabSlug): void {
  const box = document.querySelector<HTMLElement>("#project-tab-content");
  if (!box) return;
  tabController?.abort(); // đổi tab giữa chừng -> bỏ request của tab cũ
  if (tab === "vi-tri" && currentProject) {
    loadLocation(box, currentProject);
    return;
  }
  const label = PROJECT_TABS.find((t) => t.slug === tab)?.label ?? "";
  box.innerHTML = `<p class="project-tab-empty">Nội dung "${esc(label)}" đang được cập nhật</p>`;
}

/* ---------- Tab Vị trí: GET /portal/contents/get?contentType=LOCATION ---------- */
let currentProject: ProjectDetail | null = null;
let tabController: AbortController | undefined;

const tabSpinner = `<div class="project-tab-empty"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Đang tải...</span></div></div>`;

// Figma: ảnh bản đồ lớn -> (chữ | ảnh vệ tinh; >= 992px chia 2 cột, thiếu 1 bên thì full)
function renderLocation(content: Content | null, projectName: string): string {
  const { mapSrc, sideSrc, bodyHtml } = splitLocationContent(content);
  const embedSrc = mapEmbedSrc(content?.embedLocation);
  if (!mapSrc && !sideSrc && !bodyHtml && !embedSrc) return `<p class="project-tab-empty">Chưa có thông tin vị trí</p>`;

  const name = esc(projectName);
  const twoCols = bodyHtml && sideSrc;
  return `
    <section class="project-location" aria-label="Vị trí dự án">
      ${mapSrc ? `<img class="project-location__map" src="${esc(mapSrc)}" alt="Bản đồ vị trí ${name}" loading="lazy" />` : ""}
      ${
        bodyHtml || sideSrc
          ? `<div class="project-location__row${twoCols ? " is-two-cols" : ""}">
              ${bodyHtml ? `<div class="project-location__text">${bodyHtml}</div>` /* đã qua DOMPurify */ : ""}
              ${sideSrc ? `<img class="project-location__side" src="${esc(sideSrc)}" alt="Ảnh vệ tinh khu vực ${name}" loading="lazy" />` : ""}
            </div>`
          : ""
      }
      ${
        embedSrc /* src đã kiểm tra chỉ là Google Maps (mapEmbedSrc) */
          ? `<iframe class="project-location__gmap" src="${esc(embedSrc)}" title="Bản đồ Google Maps ${name}"
              loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>`
          : ""
      }
    </section>`;
}

async function loadLocation(box: HTMLElement, project: ProjectDetail): Promise<void> {
  const controller = new AbortController();
  tabController = controller;
  box.innerHTML = tabSpinner;
  try {
    const content = await contentApi.getProjectContent(project.id, "LOCATION", { signal: controller.signal });
    if (controller.signal.aborted) return;
    box.innerHTML = renderLocation(content, project.name);
  } catch (err) {
    if (axios.isCancel(err) || controller.signal.aborted) return;
    console.error(err);
    box.innerHTML = `<div class="project-tab-empty">
        <p class="text-danger mb-2">Không tải được thông tin vị trí, vui lòng thử lại</p>
        <button type="button" class="btn btn-outline-primary btn-sm js-location-retry">Thử lại</button>
      </div>`;
  }
}

function setActiveTab(tab: TabSlug): void {
  document.querySelectorAll<HTMLAnchorElement>("#project-tabs .project-tab").forEach((a) => {
    const isActive = a.dataset.tab === tab;
    a.classList.toggle("active", isActive);
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  centerActiveTab();
  renderTabContent(tab);
}

function bindTabs(): void {
  root?.addEventListener("click", (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("#project-tabs .project-tab");
    if (!link) return;
    // Ctrl/Cmd/Shift/chuột giữa: để trình duyệt mở tab mới như link thường
    if (e instanceof MouseEvent && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0)) return;
    e.preventDefault();
    const tab = link.dataset.tab ?? "";
    if (!isTabSlug(tab) || tab === readTab()) return;
    history.pushState(null, "", link.getAttribute("href") ?? "");
    setActiveTab(tab);
  });
  // Back / Forward giữa các tab
  window.addEventListener("popstate", () => {
    if (document.querySelector("#project-tabs")) setActiveTab(readTab());
  });
}

/* ---------- Nút "Chia sẻ": sao chép link trang hiện tại ---------- */
function bindShare(): void {
  root?.addEventListener("click", async (e) => {
    if (!(e.target as HTMLElement).closest(".js-share")) return;
    try {
      await navigator.clipboard.writeText(location.origin + location.pathname + location.search);
      showToast("Đã sao chép liên kết dự án");
    } catch {
      showToast("Không thể sao chép liên kết");
    }
  });
}

/* ---------- Tải dự án ---------- */
async function loadProject(id: number): Promise<void> {
  if (!root) return;
  root.innerHTML = loadingState();
  try {
    const project = await projectApi.getDetail(id);
    const tab = readTab();
    currentProject = project;
    fixUrl(project, tab);
    document.title = `${project.name} | Website Bất Động Sản`;
    root.innerHTML = renderPage(project, tab);
    setActiveTab(tab);
  } catch (err) {
    console.error(err);
    root.innerHTML = isNotFound(err) ? messageState("Không tìm thấy dự án") : errorState();
  }
}

function init(): void {
  initMobileMenu();
  bindThumbFallback();
  bindShare();
  bindTabs();

  const id = readProjectId();
  if (id == null) {
    if (root) root.innerHTML = messageState("Không tìm thấy dự án");
    return;
  }
  root?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest(".js-retry")) loadProject(id);
    if (target.closest(".js-location-retry")) renderTabContent(readTab());
  });
  loadProject(id);
}

document.addEventListener("DOMContentLoaded", init);
