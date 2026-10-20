import axiosClient from "./axiosClient";
import { cleanParams, normalizePaged } from "./helpers";
import { PAGE_SIZE, SORT_NEWEST } from "../utils/constants";
import type { Paged } from "../types/api";
import type { Project, ProjectSearchParams } from "../types/project";

// Backend trả ảnh ở fileInfo.fullLink (có thể null), UI đọc thumbnail
type RawProject = Omit<Project, "thumbnail"> & { fileInfo?: { fullLink?: string } | null };
const toProject = ({ fileInfo, ...p }: RawProject): Project => ({ ...p, thumbnail: fileInfo?.fullLink ?? "" });

export const projectApi = {
  async search({
    page = 1,
    pageSize = PAGE_SIZE,
    sort = SORT_NEWEST,
    ...filters
  }: ProjectSearchParams = {}): Promise<Paged<Project>> {
    // UI đếm trang từ 1, backend đếm từ 0
    const params = cleanParams({ pageNumber: page - 1, pageSize, sort, ...filters });
    const { data } = await axiosClient.get("/portal/projects/search", { params });
    const paged = normalizePaged<RawProject>(data, pageSize);
    return { ...paged, items: paged.items.map(toProject) };
  },

  // Dự án HOT: toàn bộ dự án isHot, mới nhất trước (cùng endpoint search)
  // pageSize lớn để lấy "toàn bộ"; nếu backend giới hạn pageSize thì phải lặp qua các trang
  async getHotProjects(): Promise<Project[]> {
    const { items } = await projectApi.search({ pageSize: 100, isHot: true });
    return items;
  },
};