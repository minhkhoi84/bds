import axiosClient from "./axiosClient";
import { unwrap } from "./helpers";
import type { Content, ContentType } from "../types/content";

export const contentApi = {
  // Chưa nhập nội dung -> backend trả SUCCESS với data: null -> trả null
  async getProjectContent(projectId: number, contentType: ContentType, signal?: AbortSignal): Promise<Content | null> {
    const { data } = await axiosClient.get("/portal/contents/get", {
      params: { refId: projectId, refType: "PROJECT", contentType },
      signal,
    });
    const content = unwrap(data); // code khác SUCCESS -> throw
    return data?.data == null ? null : (content as Content);
  },
};
