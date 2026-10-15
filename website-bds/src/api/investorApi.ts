import axiosClient from "./axiosClient";
import { toList } from "./helpers";
import { USE_MOCK } from "../utils/constants";
import * as mock from "../mock/mockApi";
import type { Investor } from "../types/masterData";

export const investorApi = {
  async getList(): Promise<Investor[]> {
    if (USE_MOCK) return mock.getInvestors();
    const { data } = await axiosClient.post("/portal/investor/list", {});
    return toList<Investor>(data); // hiển thị name, lấy id truyền vào investorId
  },
};