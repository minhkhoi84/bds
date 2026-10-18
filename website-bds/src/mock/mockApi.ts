import { projects, investors, regions, types, statuses } from "./projects";
import { news } from "./news";
import { toProject } from "../api/mappers";
import type { GroupCode } from "../utils/constants";
import type { Paged } from "../types/api";
import type { Project, ProjectSearchParams } from "../types/project";
import type { News } from "../types/news";
import type { Investor, MasterDataItem } from "../types/masterData";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

// bỏ dấu để gõ "vinh" vẫn ra "Vĩnh"
const norm = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase();

const byNewest = (a: { createdAt: string }, b: { createdAt: string }) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

function paginate<T>(list: T[], page: number, pageSize: number): Paged<T> {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { items: list.slice((page - 1) * pageSize, page * pageSize), total, totalPages };
}

export async function searchProjects({
  page = 1, pageSize = 12, name, investorId, regionCode, typeCode, statusCode, isHot,
}: ProjectSearchParams = {}): Promise<Paged<Project>> {
  await delay();
  const list = projects
    .filter((p) => !name || norm(p.name).includes(norm(name)))
    .filter((p) => !investorId || String(p.investorId) === String(investorId))
    .filter((p) => !regionCode || p.regionCode === regionCode)
    .filter((p) => !typeCode || p.typeCode === typeCode)
    .filter((p) => !statusCode || p.statusCode === statusCode)
    .filter((p) => isHot === undefined || p.isHot === isHot)
    .sort(byNewest)
    .map(toProject);
  return paginate(list, page, pageSize);
}

export async function getInvestors(): Promise<Investor[]> {
  await delay(100);
  return investors;
}

export async function getMasterData(groupCode: GroupCode): Promise<MasterDataItem[]> {
  await delay(100);
  const map: Record<GroupCode, MasterDataItem[]> = {
    PROJECT_REGION: regions,
    PROJECT_TYPE: types,
    PROJECT_STATUS: statuses,
  };
  return map[groupCode] ?? [];
}

export async function searchNews({ page = 1, pageSize = 4 }: { page?: number; pageSize?: number } = {}): Promise<Paged<News>> {
  await delay();
  return paginate([...news].sort(byNewest), page, pageSize);
}