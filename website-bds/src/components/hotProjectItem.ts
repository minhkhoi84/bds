import { escapeHtml as esc } from "../utils/format";
import { slugify } from "../utils/slug";
import type { Project } from "../types/project";

export function hotProjectItem(p: Project): string {
  return `
  <li class="hot-item" data-id="${esc(p.id)}" data-slug="${slugify(p.title)}">
    <img class="hot-item__img" src="${esc(p.thumbnail)}" alt="${esc(p.title)}" loading="lazy" />
    <div>
      <div class="hot-item__name">${esc(p.title)}</div>
      <div class="hot-item__addr">${esc(p.location)}</div>
    </div>
  </li>`;
}