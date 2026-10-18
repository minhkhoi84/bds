import axiosClient from "./axiosClient";
import { cleanParams, normalizePaged } from "./helpers";
import { PAGE_SIZE, SORT_NEWEST, USE_MOCK } from "../utils/constants";
import * as mock from "../mock/mockApi";
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
    if (USE_MOCK) return mock.searchProjects({ page, pageSize, ...filters });

    // UI đếm trang từ 1, backend đếm từ 0
    const params = cleanParams({ pageNumber: page - 1, pageSize, sort, ...filters });
    const { data } = await axiosClient.get("/portal/projects/search", { params });
    const paged = normalizePaged<RawProject>(data, pageSize);
    return { ...paged, items: paged.items.map(toProject) };
  },
};