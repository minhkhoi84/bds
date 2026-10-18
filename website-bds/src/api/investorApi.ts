import axiosClient, { LOOKUP_REQUEST } from "./axiosClient";
import { toList } from "./helpers";
import { USE_MOCK } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { ApiResponse, RawInvestor } from "../types/api";
import type { Investor } from "../types/masterData";

export const investorApi = {
  async getList(): Promise<Investor[]> {
    if (USE_MOCK) return mock.getInvestors();
    const { data } = await axiosClient.get<ApiResponse<RawInvestor[]>>("/portal/investor/list", {
      ...LOOKUP_REQUEST,
      params: { pageNumber: 0, pageSize: 100 },
    });
    // hiển thị name, lấy id truyền vào investorId
    return toList(data).map(({ id, name }) => ({ id, name }));
  },
};
