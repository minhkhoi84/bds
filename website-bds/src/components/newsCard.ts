import { escapeHtml as esc, formatDate } from "../utils/format";
import type { News } from "../types/news";

// Render 1 thẻ tin tức (4 thẻ / hàng trên desktop)
export function newsCard(n: News): string {
  return `
  <div class="col-12 col-sm-6 col-lg-3">
    <a href="/tin-tuc/${esc(n.id)}" class="news-card">
      <img class="news-card__img" src="${esc(n.thumbnail)}" alt="${esc(n.title)}" loading="lazy" />
      <div class="news-card__body">
        <div class="news-card__heading">
          <h3 class="news-card__title">${esc(n.title)}</h3>
          <span class="news-card__date">${formatDate(n.createdAt)}</span>
        </div>
        <p class="news-card__desc">${esc(n.shortDescription)}</p>
      </div>
    </a>
  </div>`;
}
