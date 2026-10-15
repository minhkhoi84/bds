import './scss/main.scss';
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import { MOCK_PROJECTS, MOCK_HOT_PROJECTS, PROJECTS_PER_PAGE } from './mock/projects.mock';
import { renderProjectCard, renderHotProjectItem } from './components/projectCard';
import { renderPagination } from './components/pagination';
import { news } from './mock/news';
import { newsCard } from './components/newsCard';
import { showToast } from './utils/toast';

const TOTAL_PAGES = Math.max(1, Math.ceil(MOCK_PROJECTS.length / PROJECTS_PER_PAGE));

// Danh sách dự án: mỗi trang 12 mục
function renderProjectList(page: number): void {
  const container = document.querySelector<HTMLElement>('#project-list-container');
  if (!container) return;
  const start = (page - 1) * PROJECTS_PER_PAGE;
  container.innerHTML = MOCK_PROJECTS
    .slice(start, start + PROJECTS_PER_PAGE)
    .map(renderProjectCard)
    .join('');
}

function renderProjectPagination(page: number): void {
  const container = document.querySelector<HTMLElement>('#project-pagination');
  if (!container) return;
  renderPagination(container, { page, totalPages: TOTAL_PAGES }, goToPage);
}

function goToPage(page: number): void {
  renderProjectList(page);
  renderProjectPagination(page);
  // Cuộn lên đầu danh sách dự án
  document.querySelector('.project-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Nút "Chia sẻ": sao chép link dự án, không chuyển trang (gắn 1 lần cho cả danh sách)
function bindShareButtons(): void {
  const container = document.querySelector<HTMLElement>('#project-list-container');
  if (!container) return;
  container.addEventListener('click', async (event) => {
    const shareButton = (event.target as HTMLElement).closest('.js-share');
    if (!shareButton) return;
    const card = shareButton.closest<HTMLElement>('[data-id]');
    const url = `${location.origin}/du-an/${card?.dataset.id ?? ''}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Đã sao chép liên kết dự án');
    } catch {
      showToast('Không thể sao chép liên kết');
    }
  });
}

function renderHotProjects(): void {
  const container = document.querySelector<HTMLElement>('#hot-projects-container');
  if (!container) return;
  container.innerHTML = MOCK_HOT_PROJECTS.map(renderHotProjectItem).join('');
}

// Tin tức: 4 bài mới nhất
function renderNews(): void {
  const container = document.querySelector<HTMLElement>('#news-list-container');
  if (!container) return;
  const latestNews = [...news]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  container.innerHTML = latestNews.map(newsCard).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  bindShareButtons();
  renderProjectList(1);
  renderProjectPagination(1);
  renderHotProjects();
  renderNews();
});
