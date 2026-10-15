import axiosClient from "./axiosClient";
import { toList } from "./helpers";
import { USE_MOCK, type GroupCode } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { MasterDataItem } from "../types/masterData";

export const masterDataApi = {
  async getByGroup(groupCode: GroupCode): Promise<MasterDataItem[]> {
    if (USE_MOCK) return mock.getMasterData(groupCode);
    const { data } = await axiosClient.post("/master-data/list", { groupCode });
    return toList<MasterDataItem>(data); // value để hiển thị, code để truyền lên API
  },
};