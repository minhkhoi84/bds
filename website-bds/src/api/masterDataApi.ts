import axiosClient from "./axiosClient";
import { toList } from "./helpers";
import { USE_MOCK, type GroupCode } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { MasterDataItem } from "../types/masterData";

export const masterDataApi = {
  async getByGroup(groupCode: GroupCode): Promise<MasterDataItem[]> {
    if (USE_MOCK) return mock.getMasterData(groupCode);
    const { data } = await axiosClient.get("/master-data/list", { params: { groupCode } });
    // value để hiển thị, code để truyền lên API
    return toList<MasterDataItem>(data).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },
};