import axiosClient, { LOOKUP_REQUEST } from "./axiosClient";
import { toList } from "./helpers";
import { USE_MOCK, type GroupCode } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { ApiResponse, RawMasterData } from "../types/api";
import type { MasterDataItem } from "../types/masterData";

export const masterDataApi = {
  async getByGroup(groupCode: GroupCode): Promise<MasterDataItem[]> {
    if (USE_MOCK) return mock.getMasterData(groupCode);
    const { data } = await axiosClient.get<ApiResponse<RawMasterData[]>>("/master-data/list", {
      ...LOOKUP_REQUEST,
      params: { groupCode },
    });
    // value để hiển thị, code để truyền lên API; sắp theo sortOrder
    return toList(data)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(({ code, value }) => ({ code, value }));
  },
};
