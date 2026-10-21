import { escapeHtml as esc, formatDate } from "../utils/format";
import { newsDetailUrl } from "../utils/slug";
import { thumb } from "./thumb";
import type { News } from "../types/news";

// Render 1 thẻ tin tức (4 thẻ / hàng trên desktop)
export function newsCard(n: News): string {
  const desc = n.shortDescription ? `<p class="news-card__desc">${esc(n.shortDescription)}</p>` : "";
  return `
  <div class="col-12 col-sm-6 col-lg-3 news-list__item">
    <a href="${esc(newsDetailUrl(n.id))}" class="news-card">
      ${thumb(n.thumbnail, "news-card__img", n.title)}
      <div class="news-card__body">
        <div class="news-card__heading">
          <h3 class="news-card__title">${esc(n.title)}</h3>
          <span class="news-card__date">${formatDate(n.createdAt)}</span>
        </div>
        ${desc}
      </div>
    </a>
  </div>`;
}
