import axiosClient from "./axiosClient";
import { cleanParams, normalizePaged } from "./helpers";
import { PAGE_SIZE, SORT_NEWEST, USE_MOCK } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { Paged } from "../types/api";
import type { Project, ProjectSearchParams } from "../types/project";

export const projectApi = {
  async search({
    page = 1,
    pageSize = PAGE_SIZE,
    sort = SORT_NEWEST,
    ...filters
  }: ProjectSearchParams = {}): Promise<Paged<Project>> {
    if (USE_MOCK) return mock.searchProjects({ page, pageSize, ...filters });

    const payload = cleanParams({ page, pageSize, sort, ...filters });
    // Nếu backend là GET: axiosClient.get("/portal/projects/search", { params: payload })
    const { data } = await axiosClient.post("/portal/projects/search", payload);
    return normalizePaged<Project>(data, pageSize);
  },
};