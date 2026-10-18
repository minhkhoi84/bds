import type { Project, HotProject } from '../types/project';
import { escapeHtml as esc } from '../utils/format';
import { projectDetailUrl, slugify } from '../utils/slug';
import { thumb } from './thumb';

// Render 1 thẻ dự án chính
export function renderProjectCard(project: Project): string {
  const hotBadge = project.isHot
    ? '<span class="project-card__status project-card__status--hot"><i class="bi bi-fire"></i> Dự Án HOT</span>'
    : '';
  const upcomingBadge = project.isUpcoming
    ? '<span class="project-card__status project-card__status--upcoming"><i class="bi bi-clock-history"></i> Sắp Mở Bán</span>'
    : '';
  const typeIcon = project.type === 'high-rise' ? 'bi-buildings' : 'bi-houses';
  const slug = slugify(project.title);
  const url = esc(projectDetailUrl(project.id, slug));
  // Địa chỉ / mô tả rỗng thì ẩn dòng đó
  const addr = project.location ? `<p class="project-card__addr">${esc(project.location)}</p>` : '';
  const desc = project.description ? `<p class="project-card__desc">${esc(project.description)}</p>` : '';

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="project-card" data-id="${esc(project.id)}" data-slug="${esc(slug)}">
        <a href="${url}" class="project-card__thumb">
          ${thumb(project.thumbnail, 'project-card__img', project.title)}
          <span class="project-card__type project-card__type--${project.type}"><i class="bi ${typeIcon}"></i> ${esc(project.typeName)}</span>
          <div class="project-card__badges">
            ${hotBadge}
            ${upcomingBadge}
          </div>
        </a>
        <div class="project-card__body">
          <div class="project-card__content">
            <div class="project-card__heading">
              <h3 class="project-card__name">
                <a href="${url}">${esc(project.title)}</a>
              </h3>
              ${addr}
            </div>
            ${desc}
          </div>
          <button type="button" class="project-card__share js-share">
            <i class="bi bi-box-arrow-up-right"></i> Chia sẻ
          </button>
        </div>
      </article>
    </div>
  `;
}

// Render 1 item trong cột "Dự Án HOT"
export function renderHotProjectItem(item: HotProject): string {
  const addr = item.location ? `<span class="hot-item__addr">${esc(item.location)}</span>` : '';
  return `
    <a href="${esc(projectDetailUrl(item.id, slugify(item.title)))}" class="hot-item">
      ${thumb(item.thumbnail, 'hot-item__img', item.title)}
      <div class="hot-item__info">
        <h4 class="hot-item__name">${esc(item.title)}</h4>
        ${addr}
      </div>
    </a>
  `;
}
