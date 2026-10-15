import { escapeHtml as esc } from "../utils/format";
import { slugify } from "../utils/slug";
import type { Project } from "../types/project";

export function hotProjectItem(p: Project): string {
  return `
  <li class="hot-item" data-id="${esc(p.id)}" data-slug="${slugify(p.name)}">
    <img class="hot-item__img" src="${esc(p.thumbnail)}" alt="${esc(p.name)}" loading="lazy" />
    <div>
      <div class="hot-item__name">${esc(p.name)}</div>
      <div class="hot-item__addr">${esc(p.address)}</div>
    </div>
  </li>`;
}