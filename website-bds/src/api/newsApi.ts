import axiosClient from "./axiosClient";
import { normalizePaged } from "./helpers";
import { SORT_NEWEST } from "../utils/constants";
import type { Paged } from "../types/api";
import type { News } from "../types/news";

// Backend trả mô tả ở shortContent, ảnh ở fileInfo.fullLink (có thể null)
type RawNews = Omit<News, "thumbnail" | "shortDescription"> & {
  shortContent?: string | null;
  fileInfo?: { fullLink?: string } | null;
};
const toNews = ({ shortContent, fileInfo, ...n }: RawNews): News => ({
  ...n,
  shortDescription: shortContent ?? "",
  thumbnail: fileInfo?.fullLink ?? "",
});

export const newsApi = {
  async search({ pageSize = 4, sort = SORT_NEWEST }: { pageSize?: number; sort?: string } = {}): Promise<Paged<News>> {
    // Trang chủ chỉ lấy trang đầu, không lọc theo projectId
    const { data } = await axiosClient.get("/portal/news/search", { params: { pageNumber: 0, pageSize, sort } });
    const paged = normalizePaged<RawNews>(data, pageSize);
    return { ...paged, items: paged.items.map(toNews) };
  },
};