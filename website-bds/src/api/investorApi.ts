import axiosClient from "./axiosClient";
import { toList } from "./helpers";
import type { Investor } from "../types/masterData";

export const investorApi = {
  async getList(): Promise<Investor[]> {
    const { data } = await axiosClient.get("/portal/investor/list", { params: { pageNumber: 0, pageSize: 100 } });
    return toList<Investor>(data); // hiển thị name, lấy id truyền vào investorId
  },
};