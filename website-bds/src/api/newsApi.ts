import axiosClient from "./axiosClient";
import { normalizePaged } from "./helpers";
import { toNews } from "./mappers";
import { SORT_NEWEST, USE_MOCK } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { ApiResponse, Paged, RawNews } from "../types/api";
import type { News } from "../types/news";

export const newsApi = {
  // 4 tin mới nhất, không lọc theo projectId
  async search({ pageSize = 4, sort = SORT_NEWEST }: { pageSize?: number; sort?: string } = {}): Promise<Paged<News>> {
    if (USE_MOCK) return mock.searchNews({ pageSize });
    const { data } = await axiosClient.get<ApiResponse<RawNews[]>>("/portal/news/search", {
      params: { pageNumber: 0, pageSize, sort },
    });
    return normalizePaged(data, toNews);
  },
};
