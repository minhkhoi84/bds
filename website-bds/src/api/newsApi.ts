import axiosClient from "./axiosClient";
import { normalizePaged } from "./helpers";
import { SORT_NEWEST, USE_MOCK } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { Paged } from "../types/api";
import type { News } from "../types/news";

export const newsApi = {
  async search({ pageSize = 4, sort = SORT_NEWEST }: { pageSize?: number; sort?: string } = {}): Promise<Paged<News>> {
    if (USE_MOCK) return mock.searchNews({ pageSize });
    const { data } = await axiosClient.post("/portal/news/search", { pageSize, sort });
    return normalizePaged<News>(data, pageSize);
  },
};