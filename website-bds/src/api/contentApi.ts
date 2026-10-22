import axiosClient from "./axiosClient";
import { unwrap } from "./helpers";
import type { ApiResponse } from "../types/api";
import type { Content, ContentType } from "../types/content";

export const contentApi = {
  // Chưa nhập nội dung -> backend trả SUCCESS với data: null -> trả null (không phải lỗi)
  async getProjectContent(
    projectId: number,
    contentType: ContentType,
    { signal }: { signal?: AbortSignal } = {}
  ): Promise<Content | null> {
    const { data } = await axiosClient.get<ApiResponse<Content | null>>("/portal/contents/get", {
      params: { refId: projectId, refType: "PROJECT", contentType },
      signal,
    });
    return unwrap(data).data ?? null;
  },
};
