import axiosClient from "./axiosClient";
import { cleanParams, normalizePaged, unwrap } from "./helpers";
import { toProject, toProjectDetail } from "./mappers";
import { PAGE_SIZE, SORT_NEWEST } from "../utils/constants";
import type { ApiResponse, Paged, RawProject } from "../types/api";
import type { Project, ProjectDetail, ProjectSearchParams } from "../types/project";

export const projectApi = {
  async search({
    page = 1,
    pageSize = PAGE_SIZE,
    sort = SORT_NEWEST,
    ...filters
  }: ProjectSearchParams = {}, { signal }: { signal?: AbortSignal } = {}): Promise<Paged<Project>> {
    // UI đếm trang từ 1, backend đếm từ 0
    const params = cleanParams({ pageNumber: page - 1, pageSize, sort, ...filters });
    const { data } = await axiosClient.get<ApiResponse<RawProject[]>>("/portal/projects/search", { params, signal });
    return normalizePaged(data, toProject);
  },

  // Dự án HOT: cùng endpoint, isHot=true, 100 mục
  async searchHot(): Promise<Paged<Project>> {
    return projectApi.search({ page: 1, pageSize: 100, isHot: true });
  },

  // Không tồn tại -> HTTP 404 (code RESOURCE_NOT_FOUND), axios reject. id phải là số: chuỗi -> backend trả 500
  async getDetail(id: number, { signal }: { signal?: AbortSignal } = {}): Promise<ProjectDetail> {
    const { data } = await axiosClient.get<ApiResponse<RawProject>>("/portal/projects/detail", { params: { id }, signal });
    return toProjectDetail(unwrap(data).data);
  },
};
