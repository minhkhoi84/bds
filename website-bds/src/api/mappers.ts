import { STATUS } from "../utils/constants";
import type { RawFileInfo, RawNews, RawProject } from "../types/api";
import type { Project, ProjectDetail } from "../types/project";
import type { News } from "../types/news";

// fileInfo có thể null -> thumbnail rỗng
const fileLink = (f?: RawFileInfo | null): string => f?.fullLink ?? "";

// Map dữ liệu backend sang kiểu Project mà projectCard đang đọc
export function toProject(r: RawProject): Project {
  return {
    id: r.id,
    title: r.name,
    location: (r.address ?? "").trim(),
    description: r.shortDescription ?? "",
    thumbnail: fileLink(r.fileInfo),
    type: r.typeCode === "LOW_RISE" ? "low-rise" : "high-rise", // COMPLEX dùng icon cao tầng
    typeName: r.typeName ?? "",
    isHot: !!r.isHot,
    isUpcoming: r.statusCode === STATUS.COMING_SOON,
  };
}

export function toProjectDetail(r: RawProject): ProjectDetail {
  return {
    id: r.id,
    name: r.name,
    address: (r.address ?? "").trim(),
    shortDescription: r.shortDescription ?? "",
    thumbnail: fileLink(r.fileInfo),
  };
}

export function toNews(r: RawNews): News {
  return {
    id: r.id,
    title: r.title,
    thumbnail: fileLink(r.fileInfo),
    shortDescription: r.shortContent ?? "",
    createdAt: r.createdAt,
  };
}
