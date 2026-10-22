import axiosClient from "./axiosClient";
import { cleanParams, normalizePaged, unwrap } from "./helpers";
import { PAGE_SIZE, SORT_NEWEST } from "../utils/constants";
import type { Paged } from "../types/api";
import type { Project, ProjectDetail, ProjectSearchParams } from "../types/project";

// Backend trả ảnh ở fileInfo.fullLink (có thể null), UI đọc thumbnail
type WithFileInfo<T> = Omit<T, "thumbnail"> & { fileInfo?: { fullLink?: string } | null };
const withThumbnail = <T extends { thumbnail: string }>({ fileInfo, ...p }: WithFileInfo<T>): T =>
  ({ ...p, thumbnail: fileInfo?.fullLink ?? "" }) as T;
const toProject = (p: WithFileInfo<Project>) => withThumbnail<Project>(p);

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
    const paged = normalizePaged<WithFileInfo<Project>>(data, pageSize);
    return { ...paged, items: paged.items.map(toProject) };
  },

  // Dự án HOT: toàn bộ dự án isHot, mới nhất trước (cùng endpoint search)
  // pageSize lớn để lấy "toàn bộ"; nếu backend giới hạn pageSize thì phải lặp qua các trang
  async getHotProjects(): Promise<Project[]> {
    const { items } = await projectApi.search({ pageSize: 100, isHot: true });
    return items;
  },

  // Không tồn tại -> HTTP 404, code RESOURCE_NOT_FOUND (axios reject)
  async getDetail(id: number): Promise<ProjectDetail> {
    const { data } = await axiosClient.get("/portal/projects/detail", { params: { id } });
    return withThumbnail<ProjectDetail>(unwrap(data));
  },
};