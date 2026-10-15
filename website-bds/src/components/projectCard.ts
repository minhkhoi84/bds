import type { Project, HotProject } from '../types/project';
import { escapeHtml as esc } from '../utils/format';

// Render 1 thẻ dự án chính
export function renderProjectCard(project: Project): string {
  const hotBadge = project.isHot
    ? '<span class="project-card__status project-card__status--hot"><i class="bi bi-fire"></i> Dự Án HOT</span>'
    : '';
  const upcomingBadge = project.isUpcoming
    ? '<span class="project-card__status project-card__status--upcoming"><i class="bi bi-clock-history"></i> Sắp Mở Bán</span>'
    : '';
  const typeIcon = project.type === 'high-rise' ? 'bi-buildings' : 'bi-houses';

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <article class="project-card" data-id="${esc(project.id)}">
        <a href="/du-an/${esc(project.id)}" class="project-card__thumb">
          <img class="project-card__img" src="${esc(project.thumbnail)}" alt="${esc(project.title)}" loading="lazy" />
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
                <a href="/du-an/${esc(project.id)}">${esc(project.title)}</a>
              </h3>
              <p class="project-card__addr">${esc(project.location)}</p>
            </div>
            <p class="project-card__desc">${esc(project.description)}</p>
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
  return `
    <a href="/du-an/${esc(item.id)}" class="hot-item">
      <img class="hot-item__img" src="${esc(item.thumbnail)}" alt="${esc(item.title)}" loading="lazy" />
      <div class="hot-item__info">
        <h4 class="hot-item__name">${esc(item.title)}</h4>
        <span class="hot-item__addr">${esc(item.location)}</span>
      </div>
    </a>
  `;
}
