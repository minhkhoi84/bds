import axiosClient from "./axiosClient";
import { cleanParams, normalizePaged } from "./helpers";
import { toProject } from "./mappers";
import { PAGE_SIZE, SORT_NEWEST, USE_MOCK } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { ApiResponse, Paged, RawProject } from "../types/api";
import type { Project, ProjectSearchParams } from "../types/project";

export const projectApi = {
  async search({
    page = 1,
    pageSize = PAGE_SIZE,
    sort = SORT_NEWEST,
    ...filters
  }: ProjectSearchParams = {}, { signal }: { signal?: AbortSignal } = {}): Promise<Paged<Project>> {
    if (USE_MOCK) return mock.searchProjects({ page, pageSize, ...filters });

    // UI đếm trang từ 1, backend đếm từ 0
    const params = cleanParams({ pageNumber: page - 1, pageSize, sort, ...filters });
    const { data } = await axiosClient.get<ApiResponse<RawProject[]>>("/portal/projects/search", { params, signal });
    return normalizePaged(data, toProject);
  },

  // Dự án HOT: cùng endpoint, isHot=true, 100 mục
  async searchHot(): Promise<Paged<Project>> {
    return projectApi.search({ page: 1, pageSize: 100, isHot: true });
  },
};
