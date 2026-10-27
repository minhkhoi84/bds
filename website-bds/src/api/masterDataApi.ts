import axiosClient from "./axiosClient";
import { toList } from "./helpers";
import type { GroupCode } from "../utils/constants";
import type { MasterDataItem } from "../types/masterData";

export const masterDataApi = {
  async getByGroup(groupCode: GroupCode, signal?: AbortSignal): Promise<MasterDataItem[]> {
    const { data } = await axiosClient.get("/master-data/list", { params: { groupCode }, signal });
    // value để hiển thị, code để truyền lên API
    return toList<MasterDataItem>(data).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },
};